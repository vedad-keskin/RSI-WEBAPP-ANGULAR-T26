using Market.Domain.Entities.Inventory;

namespace Market.Infrastructure.Database.Configurations.Inventory;

public sealed class InventoryCountItemConfiguration : IEntityTypeConfiguration<InventoryCountItemEntity>
{
    public void Configure(EntityTypeBuilder<InventoryCountItemEntity> builder)
    {
        builder.ToTable("InventoryCountItems");

        builder
            .HasOne(x => x.Product)
            .WithMany()
            .HasForeignKey(x => x.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(x => x.InventoryCount)
            .WithMany(x => x.Items)
            .HasForeignKey(x => x.InventoryCountId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .Property(x => x.UnitPrice)
            .HasPrecision(18, 2)
            .IsRequired();

        builder
            .Property(x => x.DifferenceValue)
            .HasPrecision(18, 2)
            .IsRequired();
    }
}
