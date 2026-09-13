using System.ComponentModel.DataAnnotations;

namespace WorksoftTaskTracker.Application.DTOs.User;

public class UpdateProfileDto
{
    [Required(ErrorMessage = "Ad-soyad zorunludur.")]
    [MinLength(2, ErrorMessage = "Ad-soyad en az 2 karakter olmalıdır.")]
    [MaxLength(100, ErrorMessage = "Ad-soyad en fazla 100 karakter olabilir.")]
    public string FullName { get; set; } = string.Empty;
}