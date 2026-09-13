using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WorksoftTaskTracker.Application.DTOs.Auth;
using WorksoftTaskTracker.Application.Interfaces;
using Microsoft.Extensions.Caching.Distributed;


namespace WorksoftTaskTracker.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly IDistributedCache _cache;

    private const int MaxFailedAttempts = 5;
    private static readonly TimeSpan LockoutDuration = TimeSpan.FromHours(1);

    public AuthController(IUserRepository userRepository, IConfiguration configuration, IDistributedCache cache)
    {
        _userRepository = userRepository;
        _configuration = configuration;
        _cache = cache;
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var lockoutKey = $"login_lockout:{ip}";

        var failedAttempts = await GetFailedAttemptsAsync(lockoutKey);
        if (failedAttempts >= MaxFailedAttempts)
        {
            return StatusCode(429, new { isSuccess = false, message = "Çok fazla başarısız deneme yapıldı. Lütfen daha sonra tekrar deneyin." });
        }

        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user == null || !user.IsActive)
        {
            await RegisterFailedAttemptAsync(lockoutKey, failedAttempts);
            return Unauthorized(new { isSuccess = false, message = "Geçersiz email veya şifre." });
        }

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            await RegisterFailedAttemptAsync(lockoutKey, failedAttempts);
            return Unauthorized(new { isSuccess = false, message = "Geçersiz email veya şifre." });
        }

        await _cache.RemoveAsync(lockoutKey);

        await _userRepository.UpdateLastLoginAsync(user.Id);
        await _userRepository.SaveChangesAsync();

        var token = GenerateJwtToken(user.Id, user.FullName, user.Role.Name);

        return Ok(new
        {
            isSuccess = true,
            data = new LoginResponseDto
            {
                Token = token,
                UserId = user.Id,
                FullName = user.FullName,
                Role = user.Role.Name
            }
        });
    }

    private async Task<int> GetFailedAttemptsAsync(string key)
    {
        var value = await _cache.GetStringAsync(key);
        return value == null ? 0 : int.Parse(value);
    }

    private async Task RegisterFailedAttemptAsync(string key, int currentAttempts)
    {
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = LockoutDuration
        };
        await _cache.SetStringAsync(key, (currentAttempts + 1).ToString(), options);
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