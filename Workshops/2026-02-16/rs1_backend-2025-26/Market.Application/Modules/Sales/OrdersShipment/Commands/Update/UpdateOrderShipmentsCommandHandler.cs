using Market.Application.Abstractions.Caching;
using Market.Application.Modules.Sales.OrdersShipment.Commands.Create;

namespace Market.Application.Modules.Sales.OrdersShipment.Commands.Update;

public sealed class UpdateOrderShipmentsCommandHandler(
    IAppDbContext ctx) : IRequestHandler<UpdateOrderShipmentsCommand, Unit>
{
    public async Task<Unit> Handle(UpdateOrderShipmentsCommand request, CancellationToken ct)
    {
        var entity = await ctx.OrderShipments
            .Where(x => x.Id == request.Id)
            .FirstOrDefaultAsync(ct);

        if (entity is null)
            throw new MarketNotFoundException($"Order shipment (ID={request.Id}) nije pronađen.");


        var order = await ctx.Orders
            .Where(x => x.Id == request.OrderId)
            .FirstOrDefaultAsync(ct);

        if (order is null)
        {
            throw new MarketNotFoundException("Order", request.OrderId);
        }


        entity.ShipmentNumber = request.ShipmentNumber.Trim();
        entity.ShippingCost = request.ShippingCost;
        entity.OrderId = request.OrderId;
        entity.Status = request.Status;

        if(entity.Status == Domain.Entities.Sales.OrderShipmentStatusType.Dostavljena)
        {
            entity.DeliveredAtUtc = DateTime.Now;
        }

        await ctx.SaveChangesAsync(ct);


        return Unit.Value;
    }
}
