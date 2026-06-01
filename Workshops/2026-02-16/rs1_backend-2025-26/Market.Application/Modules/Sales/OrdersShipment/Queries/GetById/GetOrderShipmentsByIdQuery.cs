namespace Market.Application.Modules.Sales.OrdersShipment.Queries.GetById;

public class GetOrderShipmentsByIdQuery : IRequest<GetOrderShipmentsByIdQueryDto>
{
    public int Id { get; set; }
}