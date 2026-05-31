namespace Market.Application.Modules.Sales.OrdersShipment.Commands.Create;

public class CreateOrderShipmentsCommand : IRequest<int>
{
    public required string ShipmentNumber { get; set; }
    public required int OrderId { get; set; }
    public required decimal ShippingCost { get; set; }


}