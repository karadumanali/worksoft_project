namespace WorksoftTaskTracker.Application.DTOs.Task;

public class CreateTaskDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int AssignedUserId { get; set; }
    public string Priority { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
}