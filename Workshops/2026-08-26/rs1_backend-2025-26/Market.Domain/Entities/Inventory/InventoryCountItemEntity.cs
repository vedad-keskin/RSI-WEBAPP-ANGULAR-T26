using Market.Domain.Common;
using Market.Domain.Entities.Catalog;
using Market.Domain.Entities.Sales;

namespace Market.Domain.Entities.Inventory;

/// <summary>
/// Represents a single product line within an order.
/// </summary>
public class InventoryCountItemEntity : BaseEntity
{
    /// <summary>
    /// ID of the parent order.
    /// </summary>
    public int InventoryCountId { get; set; }

    /// <summary>
    /// Associated order. (optional)
    /// </summary>
    public required InventoryCountEntity? InventoryCount { get; set; }

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
    public required int SystemQuantity { get; set; }

    /// <summary>
    /// Quantity of the product ordered.
    /// </summary>
    public required int CountedQuantity { get; set; }

    /// <summary>
    /// Quantity of the product ordered.
    /// </summary>
    public required int Difference { get; set; }

    /// <summary>
    /// Unit price of the product at the time of order.
    /// </summary>
    public required decimal UnitPrice { get; set; }

    /// <summary>
    /// Unit price of the product at the time of order.
    /// </summary>
    public required decimal DifferenceValue { get; set; }

}
