namespace Market.Application.Modules.Sales.OrderShipments.Queries.List;

public sealed class ListOrderShipmentsQueryHandler(IAppDbContext ctx)
    : IRequestHandler<ListOrderShipmentsQuery, PageResult<ListOrderShipmentsQueryDto>>
{
    public async Task<PageResult<ListOrderShipmentsQueryDto>> Handle(
        ListOrderShipmentsQuery request, CancellationToken ct)
    {
        var q = ctx.OrderShipments.AsNoTracking();

        if (request.OrderId is int oid && oid > 0)
            q = q.Where(x => x.OrderId == oid);

        var projected = q
            .OrderBy(x => x.ShipmentNumber)
            .Select(x => new ListOrderShipmentsQueryDto
            {
                Id = x.Id,
                ShipmentNumber = x.ShipmentNumber,
                OrderReferenceNumber = x.Order!.ReferenceNumber,
                Status = x.Status,
                ShippingCost = x.ShippingCost,
                ShippedAtUtc = x.ShippedAtUtc,
                DeliveredAtUtc = x.DeliveredAtUtc
            });

        return await PageResult<ListOrderShipmentsQueryDto>.FromQueryableAsync(projected, request.Paging, ct);
    }
}
