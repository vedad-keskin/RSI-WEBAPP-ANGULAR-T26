using FluentValidation;

namespace Market.Application.Modules.Sales.Orders.Commands.Create;

public sealed class CreateInventoryCountCommandValidator : AbstractValidator<CreateInventoryCountCommand>
{
    public CreateInventoryCountCommandValidator()
    {
        RuleFor(x => x.CountNumber)
            .NotEmpty().WithMessage("Count number is required.")
            .Must(x => x.Trim().Length >= 5 && x.Trim().Length <= 20)
            .WithMessage("Count number must be between 5 and 20 characters.")
            .Must(x => x.Trim().StartsWith("INV-"))
            .WithMessage("Count number must start with INV-.");


        RuleFor(x => x.Note)
            .MaximumLength(500).WithMessage("Note cannot exceed 500 characters.")
            .When(x => !string.IsNullOrEmpty(x.Note));
   
        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("Inventory count must contain at least one item.");

        RuleForEach(x => x.Items)
            .SetValidator(new CreateInventoryCountCommandItemValidator());

        RuleFor(x => x.Items)
            .Must(items => items.Select(i => i.ProductId).Distinct().Count() == items.Count)
            .WithMessage("Inventory count cannot contain duplicate products.")
            .When(x => x.Items != null && x.Items.Any());
    }
}

public sealed class CreateInventoryCountCommandItemValidator : AbstractValidator<CreateInventoryCountCommandItem>
{
    public CreateInventoryCountCommandItemValidator()
    {
        RuleFor(x => x.ProductId)
            .GreaterThan(0).WithMessage("ProductId must be greater than 0.");

        RuleFor(x => x.CountedQuantity)
            .InclusiveBetween(0, 100000).WithMessage("Counted quantity must be between 0 and 100000.");
    }
}
