using WorksoftTaskTracker.Application.DTOs.Dashboard;

namespace WorksoftTaskTracker.Application.DTOs.Dashboard;

public class DashboardSummaryDto
{
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int PendingTasks { get; set; }
    public IEnumerable<UserSummaryDto> UserSummaries { get; set; } = new List<UserSummaryDto>();
}