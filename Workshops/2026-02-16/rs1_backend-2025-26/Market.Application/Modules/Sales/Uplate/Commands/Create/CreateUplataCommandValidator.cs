using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.Uplate.Commands.Create;

public sealed class CreateUplataCommandValidator : AbstractValidator<CreateUplataCommand>
{
    public CreateUplataCommandValidator()
    {
        RuleFor(x => x.BrojUplate)
            .NotEmpty().WithMessage("BrojUplate is required.")
            .MaximumLength(UplataEntity.Constraints.BrojUplateMaxLength);

        RuleFor(x => x.OrderId)
            .GreaterThan(0).WithMessage("OrderId must be greater than 0.");

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("Payment must have at least one line.");

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(x => x.ProductId)
                .GreaterThan(0).WithMessage("ProductId must be greater than 0.");

            item.RuleFor(x => x.Kolicina)
                .GreaterThan(0).WithMessage("Kolicina must be greater than 0.");

            item.RuleFor(x => x.NacinPlacanja)
                .IsInEnum().WithMessage("NacinPlacanja is invalid.");
        });
    }
}
