using Market.Application.Modules.Sales.OrderShipments.Commands.Create;
using Market.Application.Modules.Sales.OrderShipments.Commands.Delete;
using Market.Application.Modules.Sales.OrderShipments.Commands.Update;
using Market.Application.Modules.Sales.OrderShipments.Queries.GetById;
using Market.Application.Modules.Sales.OrderShipments.Queries.List;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(Policy = "Staff")]
public sealed class OrderShipmentsController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateOrderShipmentCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task Update(int id, UpdateOrderShipmentCommand command, CancellationToken ct)
    {
        command.Id = id;
        await sender.Send(command, ct);
    }

    [HttpDelete("{id:int}")]
    public async Task Delete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteOrderShipmentCommand { Id = id }, ct);
    }

    [HttpGet("{id:int}")]
    public async Task<GetOrderShipmentByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        return await sender.Send(new GetOrderShipmentByIdQuery { Id = id }, ct);
    }

    [HttpGet]
    public async Task<PageResult<ListOrderShipmentsQueryDto>> List([FromQuery] ListOrderShipmentsQuery query, CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }
}
