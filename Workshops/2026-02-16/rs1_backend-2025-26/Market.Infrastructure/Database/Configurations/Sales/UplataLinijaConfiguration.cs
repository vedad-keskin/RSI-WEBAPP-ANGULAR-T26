using Market.Domain.Entities.Sales;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Market.Infrastructure.Database.Configurations.Sales;

public class UplataLinijaConfiguration : IEntityTypeConfiguration<UplataLinijaEntity>
{
    public void Configure(EntityTypeBuilder<UplataLinijaEntity> builder)
    {
        builder
            .ToTable("UplataLinije");

        builder
            .HasOne(x => x.Product)
            .WithMany()
            .HasForeignKey(x => x.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(x => x.Uplata)
            .WithMany(x => x.Linije)
            .HasForeignKey(x => x.UplataId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
