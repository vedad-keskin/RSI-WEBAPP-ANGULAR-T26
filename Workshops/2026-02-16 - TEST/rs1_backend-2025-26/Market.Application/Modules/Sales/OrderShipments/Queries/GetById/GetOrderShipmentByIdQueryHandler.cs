using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.OrderShipments.Queries.GetById;

public sealed class GetOrderShipmentByIdQueryHandler(IAppDbContext ctx)
    : IRequestHandler<GetOrderShipmentByIdQuery, GetOrderShipmentByIdQueryDto>
{
    public async Task<GetOrderShipmentByIdQueryDto> Handle(GetOrderShipmentByIdQuery request, CancellationToken ct)
    {
        var dto = await ctx.OrderShipments
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .Select(x => new GetOrderShipmentByIdQueryDto
            {
                Id = x.Id,
                ShipmentNumber = x.ShipmentNumber,
                Status = x.Status,
                ShippingCost = x.ShippingCost,
                OrderId = x.OrderId,
                ShippedAtUtc = x.ShippedAtUtc,
                DeliveredAtUtc = x.DeliveredAtUtc
            })
            .FirstOrDefaultAsync(ct);

        if (dto is null)
            throw new MarketNotFoundException($"Shipment with Id {request.Id} not found.");

        return dto;
    }
}
