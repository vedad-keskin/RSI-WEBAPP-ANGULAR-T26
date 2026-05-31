using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.OrdersShipment.Queries.GetById;

public class GetOrderShipmentsByIdQueryDto
{
    public required int Id { get; init; }
    public required string ShipmentNumber { get; set; }
    public required OrderShipmentStatusType Status { get; set; }
    public required decimal ShippingCost { get; set; }
    public required string ReferenceNumber { get; set; }
    public required int OrderId { get; set; }

    public required DateTime ShippedAtUtc { get; set; }
    public DateTime? DeliveredAtUtc { get; set; }
}
