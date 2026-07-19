using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WorksoftTaskTracker.Application.DTOs.Task;
using WorksoftTaskTracker.Application.Interfaces;
using WorksoftTaskTracker.Domain.Entities;
using Microsoft.Extensions.Caching.Distributed;

namespace WorksoftTaskTracker.API.Controllers;

[ApiController]
[Route("api/tasks")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskRepository _taskRepository;
    private readonly IDistributedCache _cache;
    private const string DashboardCacheKey = "dashboard_summary";

    public TasksController(ITaskRepository taskRepository, IDistributedCache cache)
    {
        _taskRepository = taskRepository;
        _cache = cache;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Yönetici")]
    public async Task<IActionResult> GetAll()
    {
        var tasks = await _taskRepository.GetAllAsync();

        var result = tasks.Select(t => new TaskDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            AssignedUserId = t.AssignedUserId,
            AssignedUserName = t.AssignedUser.FullName,
            Priority = t.Priority,
            Status = t.Status,
            DueDate = t.DueDate
        });

        return Ok(new { isSuccess = true, data = result });
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyTasks()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var tasks = await _taskRepository.GetByAssignedUserIdAsync(userId);

        var result = tasks.Select(t => new TaskDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            AssignedUserId = t.AssignedUserId,
            AssignedUserName = t.AssignedUser.FullName,
            Priority = t.Priority,
            Status = t.Status,
            DueDate = t.DueDate
        });

        return Ok(new { isSuccess = true, data = result });
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Yönetici")]
    public async Task<IActionResult> Create([FromBody] CreateTaskDto request)
    {
        var createdBy = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var task = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            AssignedUserId = request.AssignedUserId,
            Priority = request.Priority,
            DueDate = request.DueDate,
            Status = "Bekliyor",
            CreatedBy = createdBy,
            CreatedDate = DateTime.UtcNow
        };

        await _taskRepository.AddAsync(task);
        await _taskRepository.SaveChangesAsync();
        await _cache.RemoveAsync(DashboardCacheKey);

        return Ok(new { isSuccess = true, message = "Görev başarıyla oluşturuldu." });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Yönetici")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskDto request)
    {
        var task = await _taskRepository.GetByIdAsync(id);
        if (task == null)
            return NotFound(new { isSuccess = false, message = "Görev bulunamadı." });

        task.Title = request.Title;
        task.Description = request.Description;
        task.AssignedUserId = request.AssignedUserId;
        task.Priority = request.Priority;
        task.DueDate = request.DueDate;

        await _taskRepository.UpdateAsync(task);
        await _taskRepository.SaveChangesAsync();
        await _cache.RemoveAsync(DashboardCacheKey);

        return Ok(new { isSuccess = true, message = "Görev başarıyla güncellendi." });
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTaskStatusDto request)
    {
        var task = await _taskRepository.GetByIdAsync(id);
        if (task == null)
            return NotFound(new { isSuccess = false, message = "Görev bulunamadı." });

        if (task.Status == "Tamamlandı")
            return BadRequest(new { isSuccess = false, message = "Tamamlanmış bir görevin durumu değiştirilemez." });

        task.Status = request.Status;

        await _taskRepository.UpdateAsync(task);
        await _taskRepository.SaveChangesAsync();
        await _cache.RemoveAsync(DashboardCacheKey);

        return Ok(new { isSuccess = true, message = "Görev durumu güncellendi." });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Yönetici")]
    public async Task<IActionResult> Delete(int id)
    {
        var task = await _taskRepository.GetByIdAsync(id);
        if (task == null)
            return NotFound(new { isSuccess = false, message = "Görev bulunamadı." });

        await _taskRepository.DeleteAsync(task);
        await _taskRepository.SaveChangesAsync();
        await _cache.RemoveAsync(DashboardCacheKey);

        return Ok(new { isSuccess = true, message = "Görev başarıyla silindi." });
    }
}