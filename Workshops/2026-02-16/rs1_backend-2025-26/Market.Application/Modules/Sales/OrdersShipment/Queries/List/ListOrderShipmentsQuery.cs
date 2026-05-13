namespace Market.Application.Modules.Sales.OrdersShipment.Queries.List;

public sealed class ListOrderShipmentsQuery : BasePagedQuery<ListOrderShipmentsQueryDto>
{
    public int? OrderId { get; init; }
}
