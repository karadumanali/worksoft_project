using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using WorksoftTaskTracker.Application.DTOs.Dashboard;
using WorksoftTaskTracker.Application.Interfaces;
using WorksoftTaskTracker.Infrastructure.Persistence;

namespace WorksoftTaskTracker.Infrastructure.Repositories;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;
    private readonly IDistributedCache _cache;
    private const string CacheKey = "dashboard_summary";

    public DashboardService(AppDbContext context, IDistributedCache cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<DashboardSummaryDto> GetSummaryAsync()
    {
        var cached = await _cache.GetStringAsync(CacheKey);
        if (cached != null)
            return JsonSerializer.Deserialize<DashboardSummaryDto>(cached)!;

        var tasks = await _context.Tasks
            .Include(t => t.AssignedUser)
            .ToListAsync();

        var summary = new DashboardSummaryDto
        {
            TotalTasks = tasks.Count,
            CompletedTasks = tasks.Count(t => t.Status == "Tamamlandı"),
            PendingTasks = tasks.Count(t => t.Status == "Bekliyor"),
            UserSummaries = tasks
                .GroupBy(t => t.AssignedUser)
                .Select(g => new UserSummaryDto
                {
                    FullName = g.Key.FullName,
                    Completed = g.Count(t => t.Status == "Tamamlandı"),
                    Pending = g.Count(t => t.Status == "Bekliyor"),
                    Total = g.Count()
                }).ToList()
        };

        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
        };

        await _cache.SetStringAsync(CacheKey, JsonSerializer.Serialize(summary), options);

        return summary;
    }
}