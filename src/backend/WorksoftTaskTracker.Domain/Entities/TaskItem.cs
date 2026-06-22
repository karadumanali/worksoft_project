namespace WorksoftTaskTracker.Domain.Entities;

public class TaskItem
{
    public int Id { get; set; }
    public int AssignedUserId { get; set; }
    public int CreatedBy { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Bekliyor";
    public string Priority { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public DateTime CreatedDate { get; set; }

    public User AssignedUser { get; set; } = null!;
    public User CreatedByUser { get; set; } = null!;
}