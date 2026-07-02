using System.ComponentModel.DataAnnotations;

namespace WorksoftTaskTracker.Application.DTOs.Task;

public class CreateTaskDto
{
    [Required(ErrorMessage = "Görev başlığı zorunludur.")]
    [MaxLength(200, ErrorMessage = "Başlık en fazla 200 karakter olabilir.")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Açıklama en fazla 500 karakter olabilir.")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Atanan kişi zorunludur.")]
    [Range(1, int.MaxValue, ErrorMessage = "Geçerli bir kullanıcı seçiniz.")]
    public int AssignedUserId { get; set; }

    [Required(ErrorMessage = "Öncelik alanı zorunludur.")]
    public string Priority { get; set; } = string.Empty;

    [Required(ErrorMessage = "Bitiş tarihi zorunludur.")]
    public DateTime DueDate { get; set; }
}