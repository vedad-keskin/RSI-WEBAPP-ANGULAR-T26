using Market.Application.Modules.Catalog.ProductOffers.Commands.Create;
using Market.Application.Modules.Catalog.ProductOffers.Commands.Delete;
using Market.Application.Modules.Catalog.ProductOffers.Commands.Update;
using Market.Application.Modules.Catalog.ProductOffers.Queries.GetById;
using Market.Application.Modules.Catalog.ProductOffers.Queries.List;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(Policy = "AdminOnly")]
public class ProductOffersController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateProductOfferCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task Update(int id, UpdateProductOfferCommand command, CancellationToken ct)
    {
        // ID from the route takes precedence
        command.Id = id;
        await sender.Send(command, ct);
        // no return -> 204 No Content
    }

    [HttpDelete("{id:int}")]
    public async Task Delete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteProductOfferCommand { Id = id }, ct);
        // no return -> 204 No Content
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<GetProductOfferByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        var offer = await sender.Send(new GetProductOfferByIdQuery { Id = id }, ct);
        return offer; // if NotFoundException -> 404 via middleware
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<PageResult<ListProductOffersQueryDto>> List([FromQuery] ListProductOffersQuery query, CancellationToken ct)
    {
        var result = await sender.Send(query, ct);
        return result;
    }
}
