using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.OrderShipments.Commands.Create;

public sealed class CreateOrderShipmentCommand : IRequest<int>
{
    public required string ShipmentNumber { get; init; }
    public required decimal ShippingCost { get; init; }
    public required int OrderId { get; init; }

}
