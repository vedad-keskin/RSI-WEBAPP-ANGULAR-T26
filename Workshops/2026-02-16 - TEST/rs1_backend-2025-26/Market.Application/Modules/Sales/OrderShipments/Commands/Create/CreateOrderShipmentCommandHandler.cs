using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.OrderShipments.Commands.Create;

public sealed class CreateOrderShipmentCommandHandler(IAppDbContext ctx)
    : IRequestHandler<CreateOrderShipmentCommand, int>
{
    public async Task<int> Handle(CreateOrderShipmentCommand request, CancellationToken ct)
    {
        var orderExists = await ctx.Orders.AnyAsync(o => o.Id == request.OrderId, ct);
        if (!orderExists)
            throw new MarketNotFoundException("Order", request.OrderId);

        var entity = new OrderShipmentEntity
        {
            ShipmentNumber = request.ShipmentNumber.Trim(),
            Status = request.Status,
            ShippingCost = request.ShippingCost,
            OrderId = request.OrderId,
            ShippedAtUtc = request.ShippedAtUtc,
            DeliveredAtUtc = request.DeliveredAtUtc
        };

        ctx.OrderShipments.Add(entity);
        await ctx.SaveChangesAsync(ct);

        return entity.Id;
    }
}
