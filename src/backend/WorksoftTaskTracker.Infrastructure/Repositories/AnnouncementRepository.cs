using Microsoft.EntityFrameworkCore;
using WorksoftTaskTracker.Application.Interfaces;
using WorksoftTaskTracker.Domain.Entities;
using WorksoftTaskTracker.Infrastructure.Persistence;

namespace WorksoftTaskTracker.Infrastructure.Repositories;

public class AnnouncementRepository : IAnnouncementRepository
{
    private readonly AppDbContext _context;

    public AnnouncementRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Announcement?> GetByIdAsync(int id)
    {
        return await _context.Announcements
            .Include(a => a.CreatedByUser)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<Announcement>> GetAllAsync()
    {
        return await _context.Announcements
            .Include(a => a.CreatedByUser)
            .OrderByDescending(a => a.PublishDate)
            .ToListAsync();
    }

    public async Task AddAsync(Announcement announcement)
    {
        await _context.Announcements.AddAsync(announcement);
    }

    public async Task UpdateAsync(Announcement announcement)
    {
        _context.Announcements.Update(announcement);
    }

    public async Task DeleteAsync(Announcement announcement)
    {
        _context.Announcements.Remove(announcement);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}