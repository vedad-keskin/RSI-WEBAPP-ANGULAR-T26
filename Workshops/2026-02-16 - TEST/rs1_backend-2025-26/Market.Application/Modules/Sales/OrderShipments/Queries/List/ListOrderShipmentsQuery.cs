namespace Market.Application.Modules.Sales.OrderShipments.Queries.List;

public sealed class ListOrderShipmentsQuery : BasePagedQuery<ListOrderShipmentsQueryDto>
{
    public int? OrderId { get; init; }
}
