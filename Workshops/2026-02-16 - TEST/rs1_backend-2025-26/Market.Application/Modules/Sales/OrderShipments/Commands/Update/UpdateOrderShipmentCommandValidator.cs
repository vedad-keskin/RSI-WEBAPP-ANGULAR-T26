using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.OrderShipments.Commands.Update;

public sealed class UpdateOrderShipmentCommandValidator : AbstractValidator<UpdateOrderShipmentCommand>
{
    public UpdateOrderShipmentCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0.");

        RuleFor(x => x.ShipmentNumber)
            .NotEmpty().WithMessage("Shipment number is required.")
            .MaximumLength(OrderShipmentEntity.Constraints.ShipmentNumberMaxLength)
            .WithMessage($"Shipment number cannot exceed {OrderShipmentEntity.Constraints.ShipmentNumberMaxLength} characters.");

        RuleFor(x => x.OrderId)
            .GreaterThan(0).WithMessage("Order is required.");

        RuleFor(x => x.ShippingCost)
            .GreaterThanOrEqualTo(0).WithMessage("Shipping cost cannot be negative.");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid status.");

        RuleFor(x => x.DeliveredAtUtc)
            .GreaterThanOrEqualTo(x => x.ShippedAtUtc)
            .When(x => x.DeliveredAtUtc.HasValue)
            .WithMessage("Delivered date cannot be before shipped date.");
    }
}
