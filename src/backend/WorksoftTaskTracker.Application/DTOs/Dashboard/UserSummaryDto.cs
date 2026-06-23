namespace WorksoftTaskTracker.Application.DTOs.Dashboard;

public class UserSummaryDto
{
    public string FullName { get; set; } = string.Empty;
    public int Completed { get; set; }
    public int Pending { get; set; }
    public int Total { get; set; }
}