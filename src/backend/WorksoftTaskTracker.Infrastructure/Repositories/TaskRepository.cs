using Microsoft.EntityFrameworkCore;
using WorksoftTaskTracker.Application.Interfaces;
using WorksoftTaskTracker.Domain.Entities;
using WorksoftTaskTracker.Infrastructure.Persistence;

namespace WorksoftTaskTracker.Infrastructure.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _context;

    public TaskRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TaskItem?> GetByIdAsync(int id)
    {
        return await _context.Tasks
            .Include(t => t.AssignedUser)
            .Include(t => t.CreatedByUser)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<IEnumerable<TaskItem>> GetAllAsync()
    {
        return await _context.Tasks
            .Include(t => t.AssignedUser)
            .Include(t => t.CreatedByUser)
            .ToListAsync();
    }

    public async Task<IEnumerable<TaskItem>> GetByAssignedUserIdAsync(int userId)
    {
        return await _context.Tasks
            .Include(t => t.AssignedUser)
            .Where(t => t.AssignedUserId == userId)
            .ToListAsync();
    }

    public async Task AddAsync(TaskItem task)
    {
        await _context.Tasks.AddAsync(task);
    }

    public async Task UpdateAsync(TaskItem task)
    {
        _context.Tasks.Update(task);
    }

    public async Task DeleteAsync(TaskItem task)
    {
        _context.Tasks.Remove(task);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}