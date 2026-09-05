namespace Market.Application.Modules.Catalog.ProductOffers.Commands.Update;

public sealed class UpdateProductOfferCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int Id { get; set; }

    public string Code { get; set; }
    public int ProductId { get; set; }
    public decimal DiscountPercent { get; set; }
    public DateTime ValidUntilUtc { get; set; }
    public bool IsEnabled { get; set; }
}
