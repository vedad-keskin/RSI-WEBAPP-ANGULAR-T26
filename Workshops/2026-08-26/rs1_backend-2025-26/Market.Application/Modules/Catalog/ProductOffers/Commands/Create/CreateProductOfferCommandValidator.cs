using FluentValidation;

namespace Market.Application.Modules.Catalog.ProductOffers.Commands.Create;

public sealed class CreateProductOfferCommandValidator : AbstractValidator<CreateProductOfferCommand>
{
    public CreateProductOfferCommandValidator()
    {

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Code is required.")
            .Must(x => x.Trim().Length >= 5 && x.Trim().Length <= 20)
            .WithMessage("Code must be between 5 and 20 characters.")
            .Must(x => x.Trim().StartsWith("OFF-"))
            .WithMessage("Code must start with OFF-.");

        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage("ProductId is required.")
            .GreaterThan(0).WithMessage("ProductId must be greater than 0.");

        RuleFor(x => x.DiscountPercent)
            .NotEmpty().WithMessage("DiscountPercent is required.")
            .GreaterThan(0).WithMessage("DiscountPercent must be greater than 0.")
            .LessThanOrEqualTo(50).WithMessage("DiscountPercent must be below 50.")
            .Must(x => decimal.Round(x , 2) == x)
            .WithMessage("DiscountPercent can have a most 2 decimal places");

        RuleFor(x => x.ValidUntilUtc)
            .NotEmpty().WithMessage("ValidUntilUtc is required.")
            .Must(x => x.Date >=  DateTime.UtcNow.Date)
            .WithMessage("ValidUntilUtc must be today or later.");



    }
}
