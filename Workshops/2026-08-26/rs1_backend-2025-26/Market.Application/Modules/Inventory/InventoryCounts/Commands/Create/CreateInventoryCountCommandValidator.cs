using Market.Domain.Entities.Inventory;

namespace Market.Application.Modules.Inventory.InventoryCounts.Commands.Create;

public sealed class CreateInventoryCountCommandValidator : AbstractValidator<CreateInventoryCountCommand>
{
    public CreateInventoryCountCommandValidator()
    {
        RuleFor(x => x.CountNumber)
            .NotEmpty().WithMessage("CountNumber is required.")
            .Must(x => x.Trim().Length >= 5 && x.Trim().Length <= 20)
            .WithMessage("CountNumber must be between 5 and 20 characters.")
            .Must(x => x.Trim().StartsWith("INV-"))
            .WithMessage("CountNumber must start with INV-.");

        RuleFor(x => x.Note)
            .Must(x => x == null || x.Trim().Length <= InventoryCountEntity.Constraints.NoteMaxLength)
            .WithMessage($"Note can be at most {InventoryCountEntity.Constraints.NoteMaxLength} characters long.");

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("Inventory count must contain at least one item.");

        RuleForEach(x => x.Items)
            .SetValidator(new CreateInventoryCountCommandItemValidator());
    }
}

public sealed class CreateInventoryCountCommandItemValidator : AbstractValidator<CreateInventoryCountCommandItem>
{
    public CreateInventoryCountCommandItemValidator()
    {
        RuleFor(x => x.ProductId)
            .GreaterThan(0).WithMessage("ProductId must be greater than 0.");

        RuleFor(x => x.CountedQuantity)
            .InclusiveBetween(0, 100000).WithMessage("CountedQuantity must be between 0 and 100000.");
    }
}
