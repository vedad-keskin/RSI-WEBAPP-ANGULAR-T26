using Market.Application.Abstractions.Caching;
using Market.Application.Modules.Catalog.Products.Commands.Delete;

namespace Market.Application.Modules.Catalog.ProductOffers.Commands.Delete;

public class DeleteProductOfferCommandHandler(
    IAppDbContext context,
    IAppCurrentUser appCurrentUser,
    ICatalogCacheVersionService cacheVersionService) : IRequestHandler<DeleteProductOfferCommand, Unit>
{
    public async Task<Unit> Handle(DeleteProductOfferCommand request, CancellationToken cancellationToken)
    {

        //if (!appCurrentUser.IsAdmin)
        //    throw new MarketBusinessRuleException("123", "Samo admin moze brisati.");

        var offer = await context.ProductOffers
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (offer is null)
            throw new MarketNotFoundException("Pounda nije pronađena.");


        if (offer.IsEnabled)
            throw new MarketConflictException("Uključena ponuda se ne može obrisati. Prvo je isključite.");


        context.ProductOffers.Remove(offer);
        await context.SaveChangesAsync(cancellationToken);

        // Invalidate catalog cache
        //await cacheVersionService.BumpVersionAsync(cancellationToken);

        return Unit.Value;
    }
}
