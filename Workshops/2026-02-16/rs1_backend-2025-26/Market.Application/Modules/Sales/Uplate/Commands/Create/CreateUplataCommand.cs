using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.Uplate.Commands.Create;

public class CreateUplataCommand : IRequest<int>
{

    public required string BrojUplate { get; set; }
    public required int OrderId { get; set; }
    public string? Napomena { get; set; }
    public List<CreateUplataCommandItem> Items { get; set; } = [];
}

public class CreateUplataCommandItem
{
    public int ProductId { get; set; }
    public required decimal Kolicina { get; set; }
    public required NacinPlacanjaType NacinPlacanja { get; set; }

}