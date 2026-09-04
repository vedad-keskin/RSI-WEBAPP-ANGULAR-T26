using Market.Application.Modules.Catalog.ProductOffers.Commands.Delete;
using Market.Application.Modules.Catalog.ProductOffers.Queries.List;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(Policy = "AdminOnly")]
public class ProductOffersController(ISender sender) : ControllerBase
{
    [HttpDelete("{id:int}")]
    public async Task Delete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteProductOfferCommand { Id = id }, ct);
        // no return -> 204 No Content
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<PageResult<ListProductOffersQueryDto>> List([FromQuery] ListProductOffersQuery query, CancellationToken ct)
    {
        var result = await sender.Send(query, ct);
        return result;
    }
}
