using FluentValidation;
using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.OrdersShipment.Commands.Update;

public sealed class UpdateOrderShipmentsCommandValidator : AbstractValidator<UpdateOrderShipmentsCommand>
{
    public UpdateOrderShipmentsCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Id must be greater than 0.");

        RuleFor(x => x.ShipmentNumber)
         .NotEmpty().WithMessage("ShipmentNumber name is required.")
         .MaximumLength(OrderShipmentEntity.Constraints.ShipmentNumberMaxLength).WithMessage($"ShipmentNumber can be at most {ProductCategoryEntity.Constraints.NameMaxLength} characters long.");

        RuleFor(x => x.ShippingCost)
           .GreaterThan(0).WithMessage("ShippingCost must be greater than 0.");

        RuleFor(x => x.OrderId)
                    .GreaterThan(0).WithMessage("OrderId must be greater than 0.");

        RuleFor(x => x.Status)
                    .IsInEnum().WithMessage("Status must be enum.");

    }
}
