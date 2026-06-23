using Market.Application.Modules.Sales.Orders.Commands.Create;
using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.Uplate.Commands.Create;

public class CreateUplataCommandHandler(IAppDbContext ctx)
    : IRequestHandler<CreateUplataCommand, int>
{
    public async Task<int> Handle(CreateUplataCommand request, CancellationToken ct)
    {
 
        var order = await ctx.Orders
            .FirstOrDefaultAsync(x => x.Id == request.OrderId, ct); // pronasli smo order koji je povezan sa nasom uplatom


        if (order is null)
        {
            throw new MarketNotFoundException("Order", request.OrderId);
        }


        var uplata = new UplataEntity
        {
            BrojUplate = request.BrojUplate,
            Napomena = request.Napomena,
            OrderId = request.OrderId,
            UkupanIznos = 0m
        };

        ctx.Uplate.Add(uplata);


        // pokupiti sve id-ove proizvoda koji se naručuju
        List<int> productIds = request.Items.Select(ri => ri.ProductId).ToList(); // ne treba hashset jer filter se radi u bazi

        List<ProductEntity> products = await ctx.Products
            .Where(p => productIds.Contains(p.Id)) //<-- dorada nakon nastave za poboljsanje performansi: filtrirati samo proizvode koji su u request.Items
            .AsNoTracking()
            .ToListAsync(ct);

        Dictionary<int, ProductEntity> productsMap = products.ToDictionary(x => x.Id);


        var items = request.Items
            .GroupBy(x => (x.ProductId,  x.NacinPlacanja) )
            .Select(x => new
            {

                ProductId = x.Key.ProductId,
                NacinPlacanja = x.Key.NacinPlacanja,
                Kolicina = x.Sum(xx => xx.Kolicina)

            })
            .ToList();


        decimal ukupanIznos = 0m;



        foreach (var item in items)
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

            ukupanIznos += RoundMoney(product.Price * item.Kolicina);



            var linija = new UplataLinijeEntity
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

        if (order.BalanceDue <= 0)
        {
            order.Status = OrderStatusType.Paid;
            order.PaidAtUtc = DateTime.Now;
        }
        else
        {
            order.Status = OrderStatusType.PartiallyPaid;
        }

        //order.Status = order.BalanceDue <= 0 ? OrderStatusType.Paid : OrderStatusType.PartiallyPaid;



        await ctx.SaveChangesAsync(ct);

        return uplata.Id;

    }

    private static decimal RoundMoney(decimal value)
    {
        return Math.Round(value, 2, MidpointRounding.AwayFromZero);
    }
}