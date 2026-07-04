namespace WorksoftTaskTracker.Application.DTOs.User;

public class ProfileDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public DateTime? LastLoginDate { get; set; }
}