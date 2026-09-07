using Market.Application.Modules.Inventory.InventoryCounts.Commands.Create;
using Market.Application.Modules.Inventory.InventoryCounts.Queries.List;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(Policy = "Staff")]
public sealed class InventoryCountsController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<int> Create(CreateInventoryCountCommand command, CancellationToken ct)
    {
        return await sender.Send(command, ct);
    }

    [HttpGet]
    public async Task<PageResult<ListInventoryCountsQueryDto>> List(
        [FromQuery] ListInventoryCountsQuery query,
        CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }
}

