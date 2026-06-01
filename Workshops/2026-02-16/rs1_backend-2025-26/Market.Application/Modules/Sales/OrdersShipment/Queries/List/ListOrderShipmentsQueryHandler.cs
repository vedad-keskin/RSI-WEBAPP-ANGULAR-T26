using Market.Application.Modules.Catalog.Products.Queries.List;

namespace Market.Application.Modules.Sales.OrdersShipment.Queries.List;

public sealed class ListOrderShipmentsQueryHandler(IAppDbContext ctx)
        : IRequestHandler<ListOrderShipmentsQuery, PageResult<ListOrderShipmentsQueryDto>>
{
    public async Task<PageResult<ListOrderShipmentsQueryDto>> Handle(
        ListOrderShipmentsQuery request, CancellationToken ct)
    {
        var q = ctx.OrderShipments.AsNoTracking();

        if(request.OrderId is not null && request.OrderId > 0)
        {
            q = q.Where(x => x.OrderId == request.OrderId);
        }


        var projectedQuery = q
            .OrderBy(x => x.ShipmentNumber)
            .Select(x => new ListOrderShipmentsQueryDto
            {
                Id = x.Id,
                ShipmentNumber = x.ShipmentNumber,
                Status = x.Status,
                ReferenceNumber = x.Order!.ReferenceNumber,
                ShippingCost = x.ShippingCost,
                ShippedAtUtc = x.ShippedAtUtc,
                DeliveredAtUtc = x.DeliveredAtUtc
            });

        return await PageResult<ListOrderShipmentsQueryDto>.FromQueryableAsync(projectedQuery, request.Paging, ct);
    }


}
