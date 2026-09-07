using Market.Domain.Entities.Inventory;

namespace Market.Application.Modules.Inventory.InventoryCounts.Commands.Create;

public class CreateInventoryCountCommandHandler(IAppDbContext ctx)
    : IRequestHandler<CreateInventoryCountCommand, int>
{
    public async Task<int> Handle(CreateInventoryCountCommand request, CancellationToken ct)
    {
        var countNumber = request.CountNumber.Trim();
        var note = string.IsNullOrWhiteSpace(request.Note) ? null : request.Note.Trim();

        bool exists = await ctx.InventoryCounts
            .AnyAsync(x => x.CountNumber.ToLower() == countNumber.ToLower(), ct);

        if (exists)
            throw new MarketConflictException("Broj inventure već postoji.");

        var productIds = request.Items.Select(x => x.ProductId).ToList();

        if (productIds.Distinct().Count() != productIds.Count)
            throw new MarketConflictException("Isti proizvod se ne smije pojaviti više puta u inventuri.");

        var products = await ctx.Products
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync(ct);

        var productsMap = products.ToDictionary(x => x.Id);

        foreach (var item in request.Items)
        {
            if (!productsMap.ContainsKey(item.ProductId))
                throw new ValidationException($"Invalid productId {item.ProductId}.");
        }

        bool hasShortage = request.Items.Any(item =>
            item.CountedQuantity < productsMap[item.ProductId].StockQuantity);

        if (hasShortage && note is null)
            throw new MarketConflictException("Napomena je obavezna kada postoji manjak.");

        var parent = new InventoryCountEntity
        {
            CountNumber = countNumber,
            Note = note,
            ItemsCount = request.Items.Count,
            TotalDifferenceValue = 0m,
            CreatedAtUtc = DateTime.UtcNow,
        };

        ctx.InventoryCounts.Add(parent);

        decimal totalDifferenceValue = 0m;

        foreach (var item in request.Items)
        {
            var product = productsMap[item.ProductId];

            var systemQuantity = product.StockQuantity;
            var countedQuantity = item.CountedQuantity;
            var difference = countedQuantity - systemQuantity;
            var differenceValue = RoundMoney(difference * product.Price);

            ctx.InventoryCountItems.Add(new InventoryCountItemEntity
            {
                InventoryCount = parent,
                ProductId = item.ProductId,
                SystemQuantity = systemQuantity,
                CountedQuantity = countedQuantity,
                Difference = difference,
                UnitPrice = product.Price,
                DifferenceValue = differenceValue,
            });

            totalDifferenceValue += differenceValue;
            product.StockQuantity = countedQuantity;
        }

        parent.TotalDifferenceValue = RoundMoney(totalDifferenceValue);

        await ctx.SaveChangesAsync(ct);

        return parent.Id;
    }

    private static decimal RoundMoney(decimal value)
    {
        return Math.Round(value, 2, MidpointRounding.AwayFromZero);
    }
}
