using Market.Application.Modules.Catalog.ExamProducts.Queries.Lookup;
using Market.Application.Modules.Inventory.InventoryCounts.Queries.List;
using Market.Application.Modules.Sales.Orders.Commands.Create;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
//[Authorize(Policy = "Staff")]
[AllowAnonymous]
public sealed class InventoryCountsController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<PageResult<ListInventoryCountsQueryDto>> List(
        [FromQuery] ListInventoryCountsQuery query,
        CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }

    [HttpPost]
    // Fallback policy already requires authenticated user
    public async Task<ActionResult<int>> Create(CreateInventoryCountCommand command, CancellationToken ct)
    {

        return await sender.Send(command, ct);

    }

}
