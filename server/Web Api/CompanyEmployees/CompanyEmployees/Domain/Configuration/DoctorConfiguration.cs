using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using CompanyEmployees.Domain.Entity;

namespace CompanyEmployees.Domain.Configuration
{
    public class DoctorConfiguration : IEntityTypeConfiguration<DoctorEntity>
    {
        public void Configure(EntityTypeBuilder<DoctorEntity> builder)
        {
            builder.ToTable("Doctor");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.UserId);
            builder.HasOne(x => x.User).WithOne(x => x.Doctor).HasForeignKey<DoctorEntity>(x => x.UserId);
            builder.Property(x => x.DepartmentId);
            builder.Property(x => x.Rank);
            builder.Property(x => x.Position);
        }
    }
}
