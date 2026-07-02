using System.ComponentModel.DataAnnotations;

namespace WorksoftTaskTracker.Application.DTOs.User;

public class CreateUserDto
{
    [Required(ErrorMessage = "Ad-Soyad alanı zorunludur.")]
    [MaxLength(100, ErrorMessage = "Ad-Soyad en fazla 100 karakter olabilir.")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email alanı zorunludur.")]
    [EmailAddress(ErrorMessage = "Geçerli bir email adresi giriniz.")]
    [MaxLength(100, ErrorMessage = "Email en fazla 100 karakter olabilir.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Geçici şifre alanı zorunludur.")]
    [MinLength(6, ErrorMessage = "Şifre en az 6 karakter olmalıdır.")]
    public string TempPassword { get; set; } = string.Empty;

    [Required(ErrorMessage = "Rol alanı zorunludur.")]
    [Range(1, 3, ErrorMessage = "Geçerli bir rol seçiniz.")]
    public int RoleId { get; set; }

    public bool IsActive { get; set; } = true;
}