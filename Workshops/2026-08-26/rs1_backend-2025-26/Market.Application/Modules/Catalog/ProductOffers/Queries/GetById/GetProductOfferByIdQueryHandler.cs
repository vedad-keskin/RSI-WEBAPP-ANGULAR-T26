namespace Market.Application.Modules.Catalog.ProductOffers.Queries.GetById;

public class GetProductOfferByIdQueryHandler(IAppDbContext context) : IRequestHandler<GetProductOfferByIdQuery, GetProductOfferByIdQueryDto>
{
    public async Task<GetProductOfferByIdQueryDto> Handle(GetProductOfferByIdQuery request, CancellationToken cancellationToken)
    {
        var q = context.ProductOffers
            .Where(c => c.Id == request.Id);

        var today = DateTime.UtcNow.Date;


        var dto = await q
            .Select(x => new GetProductOfferByIdQueryDto
            {
                Id = x.Id,
                Code = x.Code,
                ProductName = x.Product!.Name,
                ProductPrice = x.Product.Price,
                DiscountPercent = x.DiscountPercent,
                DiscountPrice = Math.Round(x.Product.Price * (1 - x.DiscountPercent / 100), 2, MidpointRounding.AwayFromZero),
                ValidUntilUtc = x.ValidUntilUtc,
                IsEnabled = x.IsEnabled,
                Status = !x.IsEnabled ? ProductOfferStateType.Iskljucena : x.ValidUntilUtc >= today ? ProductOfferStateType.Aktivna : ProductOfferStateType.Istekla,
                StatusLabel = !x.IsEnabled ? "Iskljucena" : x.ValidUntilUtc >= today ? "Aktivna" : "Istekla",
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (dto == null)
        {
            throw new MarketNotFoundException($"Product offer with Id {request.Id} not found.");
        }

        return dto;
    }
}