using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.OrderShipments.Commands.Update;

public sealed class UpdateOrderShipmentCommandHandler(IAppDbContext ctx)
    : IRequestHandler<UpdateOrderShipmentCommand, Unit>
{
    public async Task<Unit> Handle(UpdateOrderShipmentCommand request, CancellationToken ct)
    {
        var entity = await ctx.OrderShipments
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (entity is null)
            throw new MarketNotFoundException($"Shipment (ID={request.Id}) not found.");

        var orderExists = await ctx.Orders.AnyAsync(o => o.Id == request.OrderId, ct);
        if (!orderExists)
            throw new MarketNotFoundException("Order", request.OrderId);

        entity.ShipmentNumber = request.ShipmentNumber.Trim();
        entity.Status = request.Status;
        entity.ShippingCost = request.ShippingCost;
        entity.OrderId = request.OrderId;
        entity.ShippedAtUtc = request.ShippedAtUtc;
        entity.DeliveredAtUtc = request.DeliveredAtUtc;

        await ctx.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
