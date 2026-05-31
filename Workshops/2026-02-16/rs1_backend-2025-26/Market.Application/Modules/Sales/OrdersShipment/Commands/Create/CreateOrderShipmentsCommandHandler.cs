using Market.Application.Abstractions.Caching;
using Market.Application.Modules.Catalog.Products.Commands.Create;
using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.OrdersShipment.Commands.Create;

public class CreateOrderShipmentsCommandHandler(
    IAppDbContext ctx) : IRequestHandler<CreateOrderShipmentsCommand, int>
{
    public async Task<int> Handle(CreateOrderShipmentsCommand request, CancellationToken ct)
    {
        var normalized = request.ShipmentNumber?.Trim(); 

        if (string.IsNullOrWhiteSpace(normalized))
            throw new ValidationException("ShipmentNumber is required.");

        // Check if a order shipment with the same ShipmentNumber already exists.
        bool exists = await ctx.OrderShipments
            .AnyAsync(x => x.ShipmentNumber == normalized, ct);

        if (exists)
        {
            throw new MarketConflictException("ShipmentNumber already exists.");
        }

        var order = await ctx.Orders
            .Where(x => x.Id == request.OrderId)
            .FirstOrDefaultAsync(ct);

        if (order is null)
        {
            throw new MarketNotFoundException("Order", request.OrderId);
        }


        var orderShipment = new OrderShipmentEntity
        {
            ShipmentNumber = request.ShipmentNumber!,
            OrderId = request.OrderId,
            ShippingCost = request.ShippingCost,
            ShippedAtUtc = DateTime.UtcNow,
            Status = OrderShipmentStatusType.Kreirana
        };

        ctx.OrderShipments.Add(orderShipment);
        await ctx.SaveChangesAsync(ct);


        return orderShipment.Id;
    }
}
