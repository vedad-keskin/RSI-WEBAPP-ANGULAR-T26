using Market.Domain.Common;
using Market.Domain.Entities.Catalog;

namespace Market.Domain.Entities.Inventory;

public class InventoryCountItemEntity : BaseEntity
{
    public int InventoryCountId { get; set; }

    public required InventoryCountEntity? InventoryCount { get; set; }

    public required int ProductId { get; set; }

    public ProductEntity? Product { get; set; }

    public required int SystemQuantity { get; set; }

    public required int CountedQuantity { get; set; }

    public required int Difference { get; set; }

    public required decimal UnitPrice { get; set; }

    public required decimal DifferenceValue { get; set; }
}
