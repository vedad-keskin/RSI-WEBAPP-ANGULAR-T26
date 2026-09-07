using Market.Application.Modules.Sales.Orders.Commands.Create;
using Market.Domain.Entities.Inventory;
using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Inventory.InventoryCounts.Commands.Create;

public class CreateInventoryCountCommandHandler(IAppDbContext ctx, IAppCurrentUser currentUser)
    : IRequestHandler<CreateInventoryCountCommand, int>
{
    public async Task<int> Handle(CreateInventoryCountCommand request, CancellationToken ct)
    {


        var countNumber = request.CountNumber.Trim();

        var note = string.IsNullOrWhiteSpace(request.Note) ? null : request.Note.Trim();

        bool exists = await ctx.InventoryCounts
            .AnyAsync(x => x.CountNumber.ToLower() == countNumber.ToLower(), ct);

        if (exists)
        {
            throw new MarketConflictException("Count number already exists.");
        }





        var parent = new InventoryCountEntity
        {
            Note = request.Note,
            CountNumber = countNumber,
            ItemsCount = request.Items.Count,
            TotalDifferenceValue = 0m,
            CreatedAtUtc = DateTime.UtcNow.Date,

        };
        ctx.InventoryCounts.Add(parent);




        // pokupiti sve id-ove proizvoda koji se naručuju
        List<int> productIds = request.Items.Select(ri => ri.ProductId).ToList(); // ne treba hashset jer filter se radi u bazi

        List<ProductEntity> products = await ctx.Products
            .Where(p => productIds.Contains(p.Id)) //<-- dorada nakon nastave za poboljsanje performansi: filtrirati samo proizvode koji su u request.Items
            //.AsNoTracking()
            .ToListAsync(ct);

        Dictionary<int, ProductEntity> productsMap = products.ToDictionary(x => x.Id);


        bool existsShortage = request.Items
            .Any(x => x.CountedQuantity < productsMap[x.ProductId].StockQuantity);

        if (existsShortage && note is null)
        {

            throw new MarketConflictException("Note is required if there is a shortage.");

        }


        decimal totalDifferenceValue = 0m;


        foreach (var item in request.Items)
        {
            ProductEntity? product = productsMap.GetValueOrDefault(item.ProductId); //<--- bolja performansa O(n) jer koristi dictionary

            if (product is null)
            {
                throw new ValidationException(message: $"Invalid productId {item.ProductId}.");
            }

            if (product.IsEnabled == false)
            {
                throw new ValidationException($"Product {product.Name} is disabled.");
            }


            var systemQuantity = product.StockQuantity;
            var countedQuantity = item.CountedQuantity;

            var difference = countedQuantity - systemQuantity;
            var unitPrice = product.Price;
            //var differenceValue = Math.Round(difference * unitPrice, 2, MidpointRounding.AwayFromZero);

            var differenceValue = RoundMoney(difference * unitPrice);


            var childItem = new InventoryCountItemEntity
            {
                InventoryCount = parent,
                ProductId = item.ProductId,
                SystemQuantity = systemQuantity,
                CountedQuantity = countedQuantity,
                UnitPrice = unitPrice,
                Difference = difference,
                DifferenceValue = differenceValue,
            };

            ctx.InventoryCountItems.Add(childItem);


            totalDifferenceValue += differenceValue;

            product.StockQuantity = countedQuantity;

            //order.TotalAmount += RoundMoney(orderItem.Total);
        }

        parent.TotalDifferenceValue = totalDifferenceValue;



        await ctx.SaveChangesAsync(ct);

        return parent.Id;
    }

    private static decimal RoundMoney(decimal value)
    {
        return Math.Round(value, 2, MidpointRounding.AwayFromZero);
    }
}