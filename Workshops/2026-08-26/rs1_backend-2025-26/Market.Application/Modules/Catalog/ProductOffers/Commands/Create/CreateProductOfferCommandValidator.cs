using FluentValidation;

namespace Market.Application.Modules.Catalog.ProductOffers.Commands.Create;

public sealed class CreateProductOfferCommandValidator : AbstractValidator<CreateProductOfferCommand>
{
    public CreateProductOfferCommandValidator()
    {
 RuleFor(x => x.Code)
    .NotEmpty()
    .Must(c => c.Trim().Length >= 5 && c.Trim().Length <= 20)
    .Must(c => c.Trim().StartsWith("OFF-"))
    .WithMessage("Code must be 5-20 characters and start with OFF-.");

        RuleFor(x => x.ProductId)
            .GreaterThan(0).WithMessage("ProductId must be greater than 0.");

        RuleFor(x => x.DiscountPercent)
            .GreaterThan(0).WithMessage("DiscountPercent must be greater than 0.")
            .LessThanOrEqualTo(50).WithMessage("DiscountPercent cannot exceed 50.")
            .Must(x => decimal.Round(x, 2) == x)
            .WithMessage("DiscountPercent can have at most 2 decimal places.");

        RuleFor(x => x.ValidUntilUtc)
            .NotEmpty().WithMessage("ValidUntilUtc is required.")
            .Must(d => d.Date >= DateTime.UtcNow.Date)
            .WithMessage("ValidUntilUtc must be today (UTC) or later.");
    }
}
