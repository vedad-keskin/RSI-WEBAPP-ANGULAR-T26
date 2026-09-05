namespace Market.Application.Modules.Catalog.ProductOffers.Queries.GetById;

public class GetProductOfferByIdQueryDto
{
    public required int Id { get; init; }
    public required string Code { get; set; }
    public required string ProductName { get; set; }
    public required decimal ProductPrice { get; set; }
    public required decimal DiscountPercent { get; set; }
    public required decimal DiscountPrice { get; set; }
    public required DateTime ValidUntilUtc { get; set; }
    public required bool IsEnabled { get; set; }
    public required ProductOfferStateType Status { get; set; }
    public required string StatusLabel { get; set; }
}
