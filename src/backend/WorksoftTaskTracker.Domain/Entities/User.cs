using WorksoftTaskTracker.Domain.Entities;
namespace WorksoftTaskTracker.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public int RoleId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastLoginDate { get; set; }

    public Role Role { get; set; } = null!;
    public ICollection<TaskItem> AssignedTasks { get; set; } = new List<TaskItem>();
    public ICollection<TaskItem> CreatedTasks { get; set; } = new List<TaskItem>();
    public ICollection<Announcement> CreatedAnnouncements { get; set; } = new List<Announcement>();
}