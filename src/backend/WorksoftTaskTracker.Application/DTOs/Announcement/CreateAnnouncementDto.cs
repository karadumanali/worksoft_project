namespace WorksoftTaskTracker.Application.DTOs.Announcement;

public class CreateAnnouncementDto
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public bool SendEmailNotification { get; set; }
}