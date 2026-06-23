namespace WorksoftTaskTracker.Application.DTOs.Announcement;

public class AnnouncementDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime PublishDate { get; set; }
}