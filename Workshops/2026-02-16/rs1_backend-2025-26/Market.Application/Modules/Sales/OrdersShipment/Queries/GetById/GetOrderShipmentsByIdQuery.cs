using Market.Application.Modules.Sales.OrdersShipment.Queries.GetById;

namespace Market.Application.Modules.Catalog.ProductCategories.Queries.GetById;

public class GetOrderShipmentsByIdQuery : IRequest<GetOrderShipmentsByIdQueryDto>
{
    public int Id { get; set; }
}