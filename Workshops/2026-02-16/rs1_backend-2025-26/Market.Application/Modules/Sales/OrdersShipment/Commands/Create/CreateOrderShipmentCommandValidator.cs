using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.OrderShipments.Commands.Create;

public sealed class CreateOrderShipmentCommandValidator : AbstractValidator<CreateOrderShipmentCommand>
{
    public CreateOrderShipmentCommandValidator()
    {
        RuleFor(x => x.ShipmentNumber)
            .NotEmpty().WithMessage("Shipment number is required.")
            .MaximumLength(OrderShipmentEntity.Constraints.ShipmentNumberMaxLength)
            .WithMessage($"Shipment number cannot exceed {OrderShipmentEntity.Constraints.ShipmentNumberMaxLength} characters.");

        RuleFor(x => x.OrderId)
            .GreaterThan(0).WithMessage("Order is required.");

        RuleFor(x => x.ShippingCost)
            .GreaterThanOrEqualTo(0).WithMessage("Shipping cost cannot be negative.");


    }
}
