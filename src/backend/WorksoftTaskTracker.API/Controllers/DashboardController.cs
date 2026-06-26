using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorksoftTaskTracker.Application.Interfaces;

namespace WorksoftTaskTracker.API.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("summary")]
    [Authorize(Roles = "Admin,Yönetici")]
    public async Task<IActionResult> GetSummary()
    {
        var summary = await _dashboardService.GetSummaryAsync();
        return Ok(new { isSuccess = true, data = summary });
    }
}