using WorksoftTaskTracker.Domain.Entities;

namespace WorksoftTaskTracker.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetAllAsync();
    Task AddAsync(User user);
    Task UpdateAsync(User user);
    Task SaveChangesAsync();

    Task UpdateLastLoginAsync(int userId);
    Task UpdateProfileAsync(int userId, string fullName);
}