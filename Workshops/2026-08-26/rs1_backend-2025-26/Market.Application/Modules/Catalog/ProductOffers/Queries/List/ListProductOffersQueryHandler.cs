using Market.Domain.Entities.Catalog;

namespace Market.Application.Modules.Catalog.ProductOffers.Queries.List;

public sealed class ListProductOffersQueryHandler(IAppDbContext ctx)
    : IRequestHandler<ListProductOffersQuery, PageResult<ListProductOffersQueryDto>>
{
    public async Task<PageResult<ListProductOffersQueryDto>> Handle(
        ListProductOffersQuery request, CancellationToken ct)
    {
        var today = DateTime.UtcNow.Date;

        var q = ctx.ProductOffers.AsNoTracking().AsQueryable();

        if (request.ProductId is not null && request.ProductId > 0)
        {
            q = q.Where(x => x.ProductId == request.ProductId);
        }

        if (request.OnlyActive)
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
                DiscountedPrice = Math.Round(x.Product.Price * (1m - x.DiscountPercent / 100m), 2, MidpointRounding.AwayFromZero),
                ValidUntilUtc = x.ValidUntilUtc,
                IsEnabled = x.IsEnabled,
                State = !x.IsEnabled
                    ? ProductOfferStateType.Iskljucena
                    : x.ValidUntilUtc < today
                        ? ProductOfferStateType.Istekla
                        : ProductOfferStateType.Aktivna,
                StateLabel = !x.IsEnabled
                    ? "Iskljucena"
                    : x.ValidUntilUtc < today
                        ? "Istekla"
                        : "Aktivna"
            });

        return await PageResult<ListProductOffersQueryDto>.FromQueryableAsync(projectedQuery, request.Paging, ct);
    }
}
