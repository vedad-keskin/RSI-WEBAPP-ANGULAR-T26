using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.OrdersShipment.Commands.Update;

public sealed class UpdateOrderShipmentsCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int Id { get; set; }
    public string ShipmentNumber { get; set; }
    public int OrderId { get; set; }
    public decimal ShippingCost { get; set; }
    public OrderShipmentStatusType Status { get; set; }

}
