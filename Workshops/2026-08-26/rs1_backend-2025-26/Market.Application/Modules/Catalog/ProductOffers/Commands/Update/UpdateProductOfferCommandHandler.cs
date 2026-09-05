namespace Market.Application.Modules.Catalog.ProductOffers.Commands.Update;

public sealed class UpdateProductOfferCommandHandler(
    IAppDbContext ctx) : IRequestHandler<UpdateProductOfferCommand, Unit>
{
    public async Task<Unit> Handle(UpdateProductOfferCommand request, CancellationToken ct)
    {
        var entity = await ctx.ProductOffers
            .Where(x => x.Id == request.Id)
            .FirstOrDefaultAsync(ct);

        if (entity is null)
            throw new MarketNotFoundException($"Ponuda (ID={request.Id}) nije pronađena.");

        var code = request.Code.Trim();

        bool codeExists = await ctx.ProductOffers
            .AnyAsync(x => x.Id != request.Id && x.Code.ToLower() == code.ToLower(), ct);

        if (codeExists)
            throw new MarketConflictException("Oznaka ponude već postoji.");

        var product = await ctx.Products
            .Where(x => x.Id == request.ProductId)
            .FirstOrDefaultAsync(ct);

        if (product is null)
            throw new MarketNotFoundException("Proizvod nije pronađen.", request.ProductId);

        if (request.IsEnabled)
        {
            var today = DateTime.UtcNow.Date;

            bool hasActiveOffer = await ctx.ProductOffers
                .AnyAsync(x =>
                    x.Id != request.Id
                    && x.ProductId == request.ProductId
                    && x.IsEnabled
                    && x.ValidUntilUtc >= today, ct);

            if (hasActiveOffer)
                throw new MarketConflictException("Proizvod već ima aktivnu ponudu.");
        }

        entity.Code = code;
        entity.ProductId = request.ProductId;
        entity.DiscountPercent = request.DiscountPercent;
        entity.ValidUntilUtc = request.ValidUntilUtc;
        entity.IsEnabled = request.IsEnabled;
        // CreatedAtUtc intentionally not changed

        await ctx.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
