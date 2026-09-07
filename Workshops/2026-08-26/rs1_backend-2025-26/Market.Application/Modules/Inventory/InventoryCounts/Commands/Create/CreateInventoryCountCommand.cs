namespace Market.Application.Modules.Inventory.InventoryCounts.Commands.Create;

public class CreateInventoryCountCommand : IRequest<int>
{
    public required string CountNumber { get; set; }
    public string? Note { get; set; }
    public List<CreateInventoryCountCommandItem> Items { get; set; } = [];
}

public class CreateInventoryCountCommandItem
{
    public int ProductId { get; set; }
    public int CountedQuantity { get; set; }
}
