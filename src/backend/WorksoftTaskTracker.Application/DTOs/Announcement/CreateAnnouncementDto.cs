using System.ComponentModel.DataAnnotations;

namespace WorksoftTaskTracker.Application.DTOs.Announcement;

public class CreateAnnouncementDto
{
    [Required(ErrorMessage = "Duyuru başlığı zorunludur.")]
    [MaxLength(200, ErrorMessage = "Başlık en fazla 200 karakter olabilir.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Duyuru içeriği zorunludur.")]
    [MaxLength(2000, ErrorMessage = "İçerik en fazla 2000 karakter olabilir.")]
    public string Content { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
    public bool SendEmailNotification { get; set; }
}