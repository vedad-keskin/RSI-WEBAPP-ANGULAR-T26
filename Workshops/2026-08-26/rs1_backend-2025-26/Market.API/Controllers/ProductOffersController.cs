using Market.Application.Modules.Catalog.ProductOffers.Queries.List;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
public sealed class ProductOffersController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<PageResult<ListProductOffersQueryDto>> List(
        [FromQuery] ListProductOffersQuery query, CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }
}
