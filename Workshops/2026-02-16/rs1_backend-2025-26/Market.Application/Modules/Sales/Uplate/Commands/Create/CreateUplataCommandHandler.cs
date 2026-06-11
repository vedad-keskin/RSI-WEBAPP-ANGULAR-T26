using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.Uplate.Commands.Create;

public class CreateUplataCommandHandler(IAppDbContext ctx)
    : IRequestHandler<CreateUplataCommand, int>
{
    public async Task<int> Handle(CreateUplataCommand request, CancellationToken ct)
    {
        var order = await ctx.Orders
            .FirstOrDefaultAsync(x => x.Id == request.OrderId, ct);

        if (order is null)
        {
            throw new MarketNotFoundException("Order", request.OrderId);
        }

        var uplata = new UplataEntity
        {
            BrojUplate = request.BrojUplate.Trim(),
            OrderId = request.OrderId,
            Napomena = request.Napomena,
            UkupanIznos = 0m
        };
        ctx.Uplate.Add(uplata);

        List<int> productIds = request.Items.Select(i => i.ProductId).ToList();

        List<ProductEntity> products = await ctx.Products
            .Where(p => productIds.Contains(p.Id))
            .AsNoTracking()
            .ToListAsync(ct);

        Dictionary<int, ProductEntity> productsMap = products.ToDictionary(x => x.Id);

        decimal ukupanIznos = 0m;

        foreach (var item in request.Items)
        {
            ProductEntity? product = productsMap.GetValueOrDefault(item.ProductId);

            if (product is null)
            {
                throw new ValidationException($"Invalid productId {item.ProductId}.");
            }

            ukupanIznos += RoundMoney(product.Price * item.Kolicina);

            var linija = new UplataLinijaEntity
            {
                Uplata = uplata,
                ProductId = item.ProductId,
                Kolicina = item.Kolicina,
                NacinPlacanja = item.NacinPlacanja
            };

            ctx.UplataLinije.Add(linija);
        }

        uplata.UkupanIznos = RoundMoney(ukupanIznos);

        order.TotalAmountPaid += uplata.UkupanIznos;
        order.BalanceDue = RoundMoney(order.TotalAmount - order.TotalAmountPaid);
        order.Status = order.BalanceDue == 0
            ? OrderStatusType.Paid
            : OrderStatusType.PartiallyPaid;

        if (order.BalanceDue == 0 && !order.PaidAtUtc.HasValue)
        {
            order.PaidAtUtc = DateTime.UtcNow;
        }

        await ctx.SaveChangesAsync(ct);

        return uplata.Id;
    }

    private static decimal RoundMoney(decimal value)
    {
        return Math.Round(value, 2, MidpointRounding.AwayFromZero);
    }
}
