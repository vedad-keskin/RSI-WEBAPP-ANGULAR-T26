using Market.Application.Modules.Catalog.ProductCategories.Queries.GetById;
using Market.Application.Modules.Sales.OrdersShipment.Commands.Create;
using Market.Application.Modules.Sales.OrdersShipment.Commands.Delete;
using Market.Application.Modules.Sales.OrdersShipment.Queries.GetById;
using Market.Application.Modules.Sales.OrdersShipment.Queries.List;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
//[Authorize(Policy = "Staff")]
public class OrderShipmentsController(ISender sender) : ControllerBase
{
    [HttpPost]
    // Fallback policy already requires authenticated user
    public async Task<ActionResult<int>> Create(CreateOrderShipmentsCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);

        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    //[HttpPut("{id:int}")]
    //public async Task Update(int id, UpdateOrderCommand command, CancellationToken ct)
    //{
    //    // ID from the route takes precedence
    //    command.Id = id;
    //    await sender.Send(command, ct);
    //    // no return -> 204 No Content
    //}

    [HttpGet("{id:int}")]
    public async Task<GetOrderShipmentsByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        var dto = await sender.Send(new GetOrderShipmentsByIdQuery { Id = id }, ct);
        return dto; // if NotFoundException -> 404 via middleware
    }

    [HttpDelete("{id:int}")]
    public async Task Delete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteOrderShipmentsCommand { Id = id }, ct);
        // no return -> 204 No Content
    }

    [HttpGet]
    public async Task<PageResult<ListOrderShipmentsQueryDto>> List([FromQuery] ListOrderShipmentsQuery query, CancellationToken ct)
    {
        var result = await sender.Send(query, ct);
        return result;
    }

}
