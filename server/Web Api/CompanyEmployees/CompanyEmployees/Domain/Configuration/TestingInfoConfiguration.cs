using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using CompanyEmployees.Domain.Entity;

namespace CompanyEmployees.Domain.Configuration
{
    public class TestingInfoConfiguration : IEntityTypeConfiguration<TestingInfoEntity>
    {
        public void Configure(EntityTypeBuilder<TestingInfoEntity> builder)
        {
            builder.ToTable("TestingInfo");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Name);
            builder.Property(x => x.Price);
            builder.Property(x => x.isExaminationService);
            builder.Property(x => x.HealthInsurancePayments);
            builder.Property(x => x.Description);
            builder.Property(x => x.DepartmentId);
            builder.HasOne(x => x.Department).WithMany(x => x.TestingInfos).HasForeignKey(x => x.DepartmentId);
        }
    }
}
