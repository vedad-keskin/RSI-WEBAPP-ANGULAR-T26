namespace Market.Application.Modules.Sales.Orders.Commands.Create;

public class CreateInventoryCountCommand : IRequest<int>
{

    public required string CountNumber { get; set; }

    public string? Note { get; set; }

    public List<CreateInventoryCountCommandItem> Items { get; set; } = [];
}

public class CreateInventoryCountCommandItem
{
    public int ProductId { get; set; }
    public required int CountedQuantity { get; set; }
}