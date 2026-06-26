using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WorksoftTaskTracker.Application.DTOs.Announcement;
using WorksoftTaskTracker.Application.Interfaces;
using WorksoftTaskTracker.Domain.Entities;

namespace WorksoftTaskTracker.API.Controllers;

[ApiController]
[Route("api/announcements")]
[Authorize]
public class AnnouncementsController : ControllerBase
{
    private readonly IAnnouncementRepository _announcementRepository;

    public AnnouncementsController(IAnnouncementRepository announcementRepository)
    {
        _announcementRepository = announcementRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var announcements = await _announcementRepository.GetAllAsync();

        var result = announcements.Select(a => new AnnouncementDto
        {
            Id = a.Id,
            Title = a.Title,
            Content = a.Content,
            IsActive = a.IsActive,
            PublishDate = a.PublishDate
        });

        return Ok(new { isSuccess = true, data = result });
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateAnnouncementDto request)
    {
        var createdBy = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var announcement = new Announcement
        {
            Title = request.Title,
            Content = request.Content,
            IsActive = request.IsActive,
            PublishDate = DateTime.UtcNow,
            CreatedBy = createdBy
        };

        await _announcementRepository.AddAsync(announcement);
        await _announcementRepository.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "Duyuru başarıyla yayınlandı." });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAnnouncementDto request)
    {
        var announcement = await _announcementRepository.GetByIdAsync(id);
        if (announcement == null)
            return NotFound(new { isSuccess = false, message = "Duyuru bulunamadı." });

        announcement.Title = request.Title;
        announcement.Content = request.Content;
        announcement.IsActive = request.IsActive;

        await _announcementRepository.UpdateAsync(announcement);
        await _announcementRepository.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "Duyuru başarıyla güncellendi." });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var announcement = await _announcementRepository.GetByIdAsync(id);
        if (announcement == null)
            return NotFound(new { isSuccess = false, message = "Duyuru bulunamadı." });

        await _announcementRepository.DeleteAsync(announcement);
        await _announcementRepository.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "Duyuru başarıyla silindi." });
    }
}