using Market.Application.Modules.Catalog.Products.Queries.List;

namespace Market.Application.Modules.Catalog.ProductOffers.Queries.List;

public sealed class ListProductOffersQueryHandler(IAppDbContext ctx)
        : IRequestHandler<ListProductOffersQuery, PageResult<ListProductOffersQueryDto>>
{
    public async Task<PageResult<ListProductOffersQueryDto>> Handle(
        ListProductOffersQuery request, CancellationToken ct)
    {

        var today = DateTime.UtcNow.Date;

        var q = ctx.ProductOffers
            .Include(x => x.Product)
            .AsNoTracking();

        if (request.ProductId is not null && request.ProductId > 0)
        {
            q = q.Where(x => x.ProductId == request.ProductId);
        }

        if (request.OnlyActive is not null && request.OnlyActive == true)
        {
            q = q.Where(x => x.IsEnabled && x.ValidUntilUtc >= today);

        }


        var projectedQuery = q
            .OrderByDescending(x => x.CreatedAtUtc)
            .ThenByDescending(x => x.Id)
            .Select(x => new ListProductOffersQueryDto
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
            });

        return await PageResult<ListProductOffersQueryDto>.FromQueryableAsync(projectedQuery, request.Paging, ct);
    }


}
