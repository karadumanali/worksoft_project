using WorksoftTaskTracker.Application.DTOs.Dashboard;

namespace WorksoftTaskTracker.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync();
}