using FluentValidation;
using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.Uplate.Commands.Create;

public sealed class CreateUplataCommandValidator : AbstractValidator<CreateUplataCommand>
{
    public CreateUplataCommandValidator()
    {
        RuleFor(x => x.BrojUplate)
            .NotEmpty().WithMessage("BrojUplate name is required.")
            .MaximumLength(UplataEntity.Constraints.BrojUplateMaxLength).WithMessage($"ShipmentNumber can be at most {UplataEntity.Constraints.BrojUplateMaxLength} characters long.");

        RuleFor(x => x.Napomena)
            .MaximumLength(UplataEntity.Constraints.NapomenaMaxLength).WithMessage($"Napomena can be at most {UplataEntity.Constraints.NapomenaMaxLength} characters long.");

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("Order must contain at least one item.");

        RuleForEach(x => x.Items)
            .SetValidator(new CreateUplataCommandItemValidator());

        //RuleFor(x => x.Items)
        //    .Must(items => items.Select(i => i.ProductId).Distinct().Count() == items.Count)
        //    .WithMessage("Order cannot contain duplicate products.")
        //    .When(x => x.Items != null && x.Items.Any());

    }
}

public sealed class CreateUplataCommandItemValidator : AbstractValidator<CreateUplataCommandItem>
{
    public CreateUplataCommandItemValidator()
    {
        RuleFor(x => x.ProductId)
            .GreaterThan(0).WithMessage("ProductId must be greater than 0.");

        RuleFor(x => x.Kolicina)
            .InclusiveBetween(1, 999).WithMessage("Kolicina must be between 1 and 999.");
    }
}
