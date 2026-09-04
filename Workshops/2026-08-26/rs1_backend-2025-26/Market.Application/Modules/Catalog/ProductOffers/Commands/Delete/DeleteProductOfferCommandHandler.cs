namespace Market.Application.Modules.Catalog.ProductOffers.Commands.Delete;

public class DeleteProductOfferCommandHandler(
    IAppDbContext context) : IRequestHandler<DeleteProductOfferCommand, Unit>
{
    public async Task<Unit> Handle(DeleteProductOfferCommand request, CancellationToken cancellationToken)
    {
        var offer = await context.ProductOffers
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (offer is null)
            throw new MarketNotFoundException("Ponuda nije pronađena.");

        if (offer.IsEnabled)
            throw new MarketConflictException("Uključena ponuda se ne može obrisati. Prvo je isključite.");

        context.ProductOffers.Remove(offer);
        await context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
