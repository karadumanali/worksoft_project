using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WorksoftTaskTracker.Application.DTOs.User;
using WorksoftTaskTracker.Application.Interfaces;
using WorksoftTaskTracker.Domain.Entities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace WorksoftTaskTracker.API.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    private readonly IConfiguration _configuration;

    public UsersController(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
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
    [Authorize(Roles = "Admin")]
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
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto request)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            return NotFound(new { isSuccess = false, message = "Kullanıcı bulunamadı." });

        user.Email = request.Email;
        user.RoleId = request.RoleId;
        user.IsActive = request.IsActive;

        if (request.ResetPassword && !string.IsNullOrEmpty(request.NewPassword))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        }

        await _userRepository.UpdateAsync(user);
        await _userRepository.SaveChangesAsync();

        return Ok(new { isSuccess = true, message = "Kullanıcı başarıyla güncellendi." });
    }



    [HttpGet("profile")]

public async Task<IActionResult> GetProfile()
{
    var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!int.TryParse(userIdStr, out var userId))
        return Unauthorized(new { isSuccess = false, message = "Geçersiz token." });

    var user = await _userRepository.GetByIdAsync(userId);
    if (user == null)
        return NotFound(new { isSuccess = false, message = "Kullanıcı bulunamadı." });

    var profile = new ProfileDto
    {
        Id = user.Id,
        FullName = user.FullName,
        Email = user.Email,
        Role = user.Role.Name,
        CreatedDate = user.CreatedDate,
        LastLoginDate = user.LastLoginDate
    };

    return Ok(new { isSuccess = true, data = profile });
}

[HttpPut("profile")]

public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto request)
{
    var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!int.TryParse(userIdStr, out var userId))
        return Unauthorized(new { isSuccess = false, message = "Geçersiz token." });

    await _userRepository.UpdateProfileAsync(userId, request.FullName);
    await _userRepository.SaveChangesAsync();

    // Güncel kullanıcıyı çek ve yeni token üret
    var user = await _userRepository.GetByIdAsync(userId);
    var newToken = GenerateJwtToken(user!.Id, user.FullName, user.Role.Name);

    return Ok(new { isSuccess = true, message = "Profil başarıyla güncellendi.", token = newToken });
}

[HttpPut("profile/password")]

public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto request)
{
    var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!int.TryParse(userIdStr, out var userId))
        return Unauthorized(new { isSuccess = false, message = "Geçersiz token." });

    var user = await _userRepository.GetByIdAsync(userId);
    if (user == null)
        return NotFound(new { isSuccess = false, message = "Kullanıcı bulunamadı." });

    var isCurrentPasswordValid = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash);
    if (!isCurrentPasswordValid)
        return BadRequest(new { isSuccess = false, message = "Mevcut şifre yanlış." });

    user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
    await _userRepository.UpdateAsync(user);
    await _userRepository.SaveChangesAsync();

    return Ok(new { isSuccess = true, message = "Şifre başarıyla değiştirildi." });
}




private string GenerateJwtToken(int userId, string fullName, string role)
{
    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]!));
    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
        new Claim(ClaimTypes.Name, fullName),
        new Claim(ClaimTypes.Role, role)
    };

    var token = new JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(
            int.Parse(_configuration["Jwt:ExpireMinutes"]!)),
        signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}
}