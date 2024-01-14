using CompanyEmployees.Domain.Entity;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace CompanyEmployees.Domain.Configuration
{
    public class MedicineConfiguration: IEntityTypeConfiguration<MedicineEntity>
    {
        public void Configure(EntityTypeBuilder<MedicineEntity> builder)
        {
            builder.ToTable("Medicine");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Title);
            builder.Property(x => x.Price);
            builder.Property(x => x.Description);
            builder.Property(x => x.HealthInsurancePayments);
        }
    }
}
