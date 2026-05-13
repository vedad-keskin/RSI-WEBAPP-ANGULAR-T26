using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.OrderShipments.Queries.List;

public sealed class ListOrderShipmentsQueryDto
{
    public required int Id { get; init; }
    public required string ShipmentNumber { get; init; }
    public required string OrderReferenceNumber { get; init; }
    public required OrderShipmentStatusType Status { get; init; }
    public required decimal ShippingCost { get; init; }
    public required DateTime ShippedAtUtc { get; init; }
    public DateTime? DeliveredAtUtc { get; init; }
}
