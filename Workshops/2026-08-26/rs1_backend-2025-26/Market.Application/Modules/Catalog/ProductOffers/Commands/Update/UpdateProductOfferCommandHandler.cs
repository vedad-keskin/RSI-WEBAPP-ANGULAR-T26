using Market.Application.Abstractions.Caching;
using Market.Application.Modules.Catalog.Products.Commands.Update;

namespace Market.Application.Modules.Catalog.ProductOffers.Commands.Update;

public sealed class UpdateProductOfferCommandHandler(
    IAppDbContext ctx,
    ICatalogCacheVersionService cacheVersionService) : IRequestHandler<UpdateProductOfferCommand, Unit>
{
    public async Task<Unit> Handle(UpdateProductOfferCommand request, CancellationToken ct)
    {


        var entity = await ctx.ProductOffers
            .Where(x => x.Id == request.Id)
            .FirstOrDefaultAsync(ct);


        if (entity is null)
            throw new MarketNotFoundException($"Ponuda (ID={request.Id}) nije pronađena.");


        var normalized = request.Code?.Trim();

        if (string.IsNullOrWhiteSpace(normalized))
            throw new ValidationException("Code is required.");

        // Check if a product with the same name already exists.
        bool exists = await ctx.ProductOffers
            .AnyAsync(x => x.Id != request.Id && x.Code.ToLower() == normalized.ToLower(), ct);

        // OFF-ZIMA -> OFF-ZIMA

        if (exists)
        {
            throw new MarketConflictException("Code already exists.");
        }

        var product = await ctx.Products
          .Where(x => x.Id == request.ProductId && !x.IsDeleted)
          .FirstOrDefaultAsync(ct);

        if (product is null)
        {
            throw new MarketNotFoundException("Product", request.ProductId);
        }

        if (request.IsEnabled)
        {



            var today = DateTime.UtcNow.Date;


            bool hasActiveOffer = await ctx.ProductOffers
                .AnyAsync(x => x.Id != request.Id 
                && x.ProductId == request.ProductId
                && x.IsEnabled
                && x.ValidUntilUtc >= today
                , ct);

            if (hasActiveOffer)
            {
                throw new MarketConflictException("Product already has active offer.");
            }




        }


        entity.Code = request.Code.Trim();
        entity.ProductId = request.ProductId;
        entity.ValidUntilUtc = request.ValidUntilUtc;
        entity.DiscountPercent = request.DiscountPercent;
        entity.IsEnabled = request.IsEnabled;

        await ctx.SaveChangesAsync(ct);

        // Invalidate catalog cache
        await cacheVersionService.BumpVersionAsync(ct);

        return Unit.Value;
    }
}
