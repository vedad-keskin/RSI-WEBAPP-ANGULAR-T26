using Market.Application.Abstractions.Caching;

namespace Market.Application.Modules.Sales.OrdersShipment.Commands.Delete;

public class DeleteOrderShipmentsCommandHandler(
    IAppDbContext context,
    IAppCurrentUser appCurrentUser
    ) : IRequestHandler<DeleteOrderShipmentsCommand, Unit>
{
    public async Task<Unit> Handle(DeleteOrderShipmentsCommand request, CancellationToken cancellationToken)
    {
        if (!appCurrentUser.IsAdmin)
            throw new MarketBusinessRuleException("123", "Samo admin moze brisati.");

        var orderShipment = await context.OrderShipments
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (orderShipment is null)
            throw new MarketNotFoundException("Pošiljka nije pronađena.");

        context.OrderShipments.Remove(orderShipment);
        await context.SaveChangesAsync(cancellationToken);

        // Invalidate catalog cache
        //await cacheVersionService.BumpVersionAsync(cancellationToken);

        return Unit.Value;
    }
}
