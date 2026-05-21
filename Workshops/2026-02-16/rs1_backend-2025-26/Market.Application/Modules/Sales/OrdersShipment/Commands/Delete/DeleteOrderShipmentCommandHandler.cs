namespace Market.Application.Modules.Sales.OrderShipments.Commands.Delete;

public sealed class DeleteOrderShipmentCommandHandler(IAppDbContext ctx)
    : IRequestHandler<DeleteOrderShipmentCommand, Unit>
{
    public async Task<Unit> Handle(DeleteOrderShipmentCommand request, CancellationToken ct)
    {
        var entity = await ctx.OrderShipments
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (entity is null)
            throw new MarketNotFoundException($"Shipment (ID={request.Id}) not found.");

        ctx.OrderShipments.Remove(entity);
        await ctx.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
