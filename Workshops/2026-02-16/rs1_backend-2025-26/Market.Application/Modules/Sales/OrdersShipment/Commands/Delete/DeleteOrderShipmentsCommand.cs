namespace Market.Application.Modules.Sales.OrdersShipment.Commands.Delete;

public class DeleteOrderShipmentsCommand : IRequest<Unit>
{
    public required int Id { get; set; }
}
