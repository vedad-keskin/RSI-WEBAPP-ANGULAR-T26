using Market.Domain.Common;
using Market.Domain.Entities.Catalog;

namespace Market.Domain.Entities.Sales;

/// <summary>
/// Represents a single line within a payment.
/// </summary>
public class UplataLinijaEntity : BaseEntity
{
    public int UplataId { get; set; }

    public UplataEntity? Uplata { get; set; }

    public required int ProductId { get; set; }

    public ProductEntity? Product { get; set; }

    public required decimal Kolicina { get; set; }

    public required NacinPlacanjaType NacinPlacanja { get; set; }
}
