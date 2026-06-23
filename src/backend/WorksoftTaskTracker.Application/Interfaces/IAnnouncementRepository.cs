using WorksoftTaskTracker.Domain.Entities;

namespace WorksoftTaskTracker.Application.Interfaces;

public interface IAnnouncementRepository
{
    Task<Announcement?> GetByIdAsync(int id);
    Task<IEnumerable<Announcement>> GetAllAsync();
    Task AddAsync(Announcement announcement);
    Task UpdateAsync(Announcement announcement);
    Task DeleteAsync(Announcement announcement);
    Task SaveChangesAsync();
}