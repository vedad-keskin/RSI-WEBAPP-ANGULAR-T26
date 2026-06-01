namespace Market.Application.Modules.Sales.OrdersShipment.Queries.GetById;

public class GetOrderShipmentsByIdQueryHandler(IAppDbContext context) : IRequestHandler<GetOrderShipmentsByIdQuery, GetOrderShipmentsByIdQueryDto>
{
    public async Task<GetOrderShipmentsByIdQueryDto> Handle(GetOrderShipmentsByIdQuery request, CancellationToken cancellationToken)
    {
        var orderShipment = await context.OrderShipments
            .Where(c => c.Id == request.Id)
            .Select(x => new GetOrderShipmentsByIdQueryDto
            {
                Id = x.Id,
                ShipmentNumber = x.ShipmentNumber,
                ShippedAtUtc = x.ShippedAtUtc,
                ShippingCost = x.ShippingCost,
                Status = x.Status,  
                DeliveredAtUtc = x.DeliveredAtUtc,
                ReferenceNumber = x.Order!.ReferenceNumber,
                OrderId = x.OrderId
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (orderShipment == null)
        {
            throw new MarketNotFoundException($"Order shipment with Id {request.Id} not found.");
        }

        return orderShipment;
    }
}