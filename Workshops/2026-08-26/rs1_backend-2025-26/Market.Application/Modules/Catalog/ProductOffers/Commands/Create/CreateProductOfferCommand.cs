namespace Market.Application.Modules.Catalog.ProductOffers.Commands.Create;

public class CreateProductOfferCommand : IRequest<int>
{
    public required string Code { get; set; }
    public int ProductId { get; set; }
    public decimal DiscountPercent { get; set; }
    public DateTime ValidUntilUtc { get; set; }
}