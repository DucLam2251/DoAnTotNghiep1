using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using CompanyEmployees.Domain.Entity;

namespace CompanyEmployees.Domain.Configuration
{
    public class DepartmentConfiguration : IEntityTypeConfiguration<DepartmentEntity>
    {
        public void Configure(EntityTypeBuilder<DepartmentEntity> builder)
        {
            builder.ToTable("Department");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Name);
            builder.Property(x => x.Code);
            builder.Property(x => x.IsActive);
            builder.HasMany(x => x.Doctors).WithOne(x => x.Department).HasForeignKey(x => x.DepartmentId);
        }
    }
}
