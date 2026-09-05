using Market.Application.Abstractions.Caching;

namespace Market.Application.Modules.Catalog.ProductOffers.Commands.Create;

public class CreateProductOfferCommandHandler(
    IAppDbContext ctx,
    ICatalogCacheVersionService cacheVersionService) : IRequestHandler<CreateProductOfferCommand, int>
{
    public async Task<int> Handle(CreateProductOfferCommand request, CancellationToken ct)
    {
        var normalized = request.Code?.Trim();

        if (string.IsNullOrWhiteSpace(normalized))
            throw new ValidationException("Code is required.");

        // Check if a product with the same name already exists.
        bool exists = await ctx.ProductOffers
            .AnyAsync(x => x.Code.ToLower() == normalized.ToLower(), ct);

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

        var today = DateTime.UtcNow.Date;


        bool hasActiveOffer = await ctx.ProductOffers
            .AnyAsync(x => x.ProductId == request.ProductId
            && x.IsEnabled
            && x.ValidUntilUtc >= today
            , ct);

        if (hasActiveOffer)
        {
            throw new MarketConflictException("Product already has active offer.");
        }


        var productOffer = new ProductOfferEntity
        {
            Code = request.Code,
            ProductId = request.ProductId, 
            ValidUntilUtc = request.ValidUntilUtc,
            DiscountPercent = request.DiscountPercent,
            IsEnabled = true // deault IsEnabled
        };

        ctx.ProductOffers.Add(productOffer);
        await ctx.SaveChangesAsync(ct);

        // Invalidate catalog cache
        await cacheVersionService.BumpVersionAsync(ct);

        return productOffer.Id;
    }
}
