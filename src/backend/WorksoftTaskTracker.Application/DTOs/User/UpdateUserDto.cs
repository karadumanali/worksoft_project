namespace WorksoftTaskTracker.Application.DTOs.User;

public class UpdateUserDto
{
    public string Email { get; set; } = string.Empty;
    public int RoleId { get; set; }
    public bool IsActive { get; set; }
    public bool ResetPassword { get; set; }
}