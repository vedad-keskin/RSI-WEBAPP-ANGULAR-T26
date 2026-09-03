using Market.Domain.Entities.Catalog;

namespace Market.Application.Modules.Catalog.ProductOffers.Queries.List;

public sealed class ListProductOffersQueryDto
{
    public required int Id { get; init; }
    public required string Code { get; set; }
    public required string ProductName { get; set; }
    public required decimal ProductPrice { get; set; }
    public required decimal DiscountPercent { get; set; }
    public required decimal DiscountedPrice { get; set; }
    public required DateTime ValidUntilUtc { get; set; }
    public required ProductOfferStateType State { get; set; }
    public required string StateLabel { get; set; }
    public required bool IsEnabled { get; set; }
}
