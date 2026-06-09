using Market.Domain.Common;
using Market.Domain.Entities.Catalog;

namespace Market.Domain.Entities.Sales;

/// <summary>
/// Represents a single product line within a payment.
/// </summary>
public class UplataLinijaEntity : BaseEntity
{
    /// <summary>
    /// ID of the parent payment.
    /// </summary>
    public int UplataId { get; set; }

    /// <summary>
    /// Associated payment. (optional)
    /// </summary>
    public required UplataEntity? Uplata { get; set; }

    /// <summary>
    /// ID of the product being paid.
    /// </summary>
    public required int ProductId { get; set; }

    /// <summary>
    /// Associated product. (optional)
    /// </summary>
    public ProductEntity? Product { get; set; }

    /// <summary>
    /// Quantity of the product paid.
    /// </summary>
    public required decimal Kolicina { get; set; }

    /// <summary>
    /// Payment method for this line.
    /// </summary>
    public required NacinPlacanjaType NacinPlacanja { get; set; }

    /// <summary>
    /// Line amount (Kolicina × unit price).
    /// </summary>
    public required decimal Iznos { get; set; }
}
