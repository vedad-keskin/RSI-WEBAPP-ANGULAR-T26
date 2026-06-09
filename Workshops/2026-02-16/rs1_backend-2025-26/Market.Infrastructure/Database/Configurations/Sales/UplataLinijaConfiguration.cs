using Market.Domain.Entities.Sales;

namespace Market.Infrastructure.Database.Configurations.Sales;

public class UplataLinijaConfiguration : IEntityTypeConfiguration<UplataLinijaEntity>
{
    public void Configure(EntityTypeBuilder<UplataLinijaEntity> builder)
    {
        builder
            .ToTable("UplataLinije");

        builder
          .HasOne(x => x.Product)
          .WithMany() // ako nemamo navigaciju, onda stavimo samo WithMany()
          .HasForeignKey(x => x.ProductId)
          .OnDelete(DeleteBehavior.Restrict);// Restrict — do not allow deleting a Product if it has UplataLinije


        builder
            .HasOne(x => x.Uplata)
            .WithMany(x=>x.Linije) // ako nemamo navigaciju, onda stavimo samo WithMany()
            .HasForeignKey(x => x.UplataId)
            .OnDelete(DeleteBehavior.Cascade);// Cascade — deleting a Uplata will delete UplataLinije
    }
}
