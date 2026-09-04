namespace Market.Application.Modules.Catalog.ProductOffers.Commands.Create;

public class CreateProductOfferCommandHandler(
    IAppDbContext ctx) : IRequestHandler<CreateProductOfferCommand, int>
{
    public async Task<int> Handle(CreateProductOfferCommand request, CancellationToken ct)
    {
        var code = request.Code.Trim();

        bool codeExists = await ctx.ProductOffers
            .AnyAsync(x => x.Code.ToLower() == code.ToLower(), ct);

        if (codeExists)
            throw new MarketConflictException("Oznaka ponude već postoji.");

        var product = await ctx.Products
            .Where(x => x.Id == request.ProductId)
            .FirstOrDefaultAsync(ct);

        if (product is null)
            throw new MarketNotFoundException("Proizvod nije pronađen.", request.ProductId);

        var today = DateTime.UtcNow.Date;

        bool hasActiveOffer = await ctx.ProductOffers
            .AnyAsync(x =>
                x.ProductId == request.ProductId
                && x.IsEnabled
                && x.ValidUntilUtc >= today, ct);

        if (hasActiveOffer)
            throw new MarketConflictException("Proizvod već ima aktivnu ponudu.");

        var offer = new ProductOfferEntity
        {
            Code = code,
            ProductId = request.ProductId,
            DiscountPercent = request.DiscountPercent,
            ValidUntilUtc = request.ValidUntilUtc,
            IsEnabled = true
        };

        ctx.ProductOffers.Add(offer);
        await ctx.SaveChangesAsync(ct);

        return offer.Id;
    }
}
