namespace Market.Application.Modules.Sales.OrderShipments.Commands.Delete;

public sealed class DeleteOrderShipmentCommand : IRequest<Unit>
{
    public required int Id { get; init; }
}
