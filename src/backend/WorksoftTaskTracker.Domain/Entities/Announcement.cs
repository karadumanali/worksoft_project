namespace WorksoftTaskTracker.Domain.Entities;

public class Announcement
{
    public int Id { get; set; }
    public int CreatedBy { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime PublishDate { get; set; }

    public User CreatedByUser { get; set; } = null!;
}