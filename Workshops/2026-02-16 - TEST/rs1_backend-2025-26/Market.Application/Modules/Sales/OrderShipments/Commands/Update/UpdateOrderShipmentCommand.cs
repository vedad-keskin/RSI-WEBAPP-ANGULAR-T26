using System.Text.Json.Serialization;
using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.OrderShipments.Commands.Update;

public sealed class UpdateOrderShipmentCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int Id { get; set; }

    public required string ShipmentNumber { get; init; }
    public required OrderShipmentStatusType Status { get; init; }
    public required decimal ShippingCost { get; init; }
    public required int OrderId { get; init; }
    public required DateTime ShippedAtUtc { get; init; }
    public DateTime? DeliveredAtUtc { get; init; }
}
