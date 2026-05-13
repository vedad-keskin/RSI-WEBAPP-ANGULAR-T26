namespace Market.Application.Modules.Sales.OrderShipments.Queries.GetById;

public sealed class GetOrderShipmentByIdQuery : IRequest<GetOrderShipmentByIdQueryDto>
{
    public int Id { get; init; }
}
