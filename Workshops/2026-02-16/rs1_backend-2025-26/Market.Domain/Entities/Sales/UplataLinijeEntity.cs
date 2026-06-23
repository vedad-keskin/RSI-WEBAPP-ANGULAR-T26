using Market.Domain.Common;
using Market.Domain.Entities.Catalog;

namespace Market.Domain.Entities.Sales;

/// <summary>
/// Represents a single product line within an order.
/// </summary>
public class UplataLinijeEntity : BaseEntity
{
    /// <summary>
    /// ID of the parent order.
    /// </summary>
    public int UplataId { get; set; }

    /// <summary>
    /// Associated order. (optional)
    /// </summary>
    public required UplataEntity? Uplata { get; set; }

    /// <summary>
    /// ID of the product being ordered.
    /// </summary>
    public required int ProductId { get; set; }

    /// <summary>
    /// Associated product. (optional)
    /// </summary>
    public ProductEntity? Product { get; set; }

    /// <summary>
    /// Quantity of the product ordered.
    /// </summary>
    public required decimal Kolicina { get; set; }

    /// <summary>
    /// Current status of the order.
    /// </summary>
    public required NacinPlacanjaType NacinPlacanja { get; set; }


}
