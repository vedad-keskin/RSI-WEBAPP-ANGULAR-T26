using Market.Application.Modules.Catalog.ProductCategories.Queries.GetById;
using Market.Application.Modules.Sales.OrdersShipment.Queries.GetById;

public sealed class GetOrderShipmentsByIdQueryValidator : AbstractValidator<GetOrderShipmentsByIdQuery>
{
    public GetOrderShipmentsByIdQueryValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id must be a positive value.");
    }
}