using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WorksoftTaskTracker.Application.DTOs.User;
using WorksoftTaskTracker.Application.Interfaces;
using WorksoftTaskTracker.Domain.Entities;

namespace WorksoftTaskTracker.API.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public UsersController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userRepository.GetAllAsync();

        var result = users.Select(u => new UserDto
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email,
            Role = u.Role.Name,
            IsActive = u.IsActive,
            CreatedDate = u.CreatedDate
        });

        return Ok(new { isSuccess = true, data = result });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDto request)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser != null)
            return BadRequest(new { isSuccess = false, message = "Bu email zaten kullanımda." });

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.TempPassword),
            RoleId = request.RoleId,
            IsActive = request.IsActive,
            CreatedDate = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "Kullanıcı başarıyla oluşturuldu." });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto request)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            return NotFound(new { isSuccess = false, message = "Kullanıcı bulunamadı." });

        user.Email = request.Email;
        user.RoleId = request.RoleId;
        user.IsActive = request.IsActive;

        if (request.ResetPassword)
        {
            var tempPassword = Guid.NewGuid().ToString("N")[..8];
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(tempPassword);
        }

        await _userRepository.UpdateAsync(user);
        await _userRepository.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "Kullanıcı başarıyla güncellendi." });
    }
}