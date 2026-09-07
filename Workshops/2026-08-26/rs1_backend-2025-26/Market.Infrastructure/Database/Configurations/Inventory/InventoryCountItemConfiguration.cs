using Market.Domain.Entities.Inventory;
using Market.Domain.Entities.Sales;

namespace Market.Infrastructure.Database.Configurations.Sales;

public class InventoryCountItemConfiguration : IEntityTypeConfiguration<InventoryCountItemEntity>
{
    public void Configure(EntityTypeBuilder<InventoryCountItemEntity> builder)
    {
        builder
            .ToTable("InventoryCountItems");

        builder
          .HasOne(x => x.Product)
          .WithMany() // ako nemamo navigaciju, onda stavimo samo WithMany()
          .HasForeignKey(x => x.ProductId)
          .OnDelete(DeleteBehavior.Restrict);// Restrict — do not allow deleting a Product if it has OrderItems


        builder
            .HasOne(x => x.InventoryCount)
            .WithMany(x=>x.Items) // ako nemamo navigaciju, onda stavimo samo WithMany()
            .HasForeignKey(x => x.InventoryCountId)
            .OnDelete(DeleteBehavior.Cascade);// Cascade — deleting a Order will delete OrderItems
    }
}