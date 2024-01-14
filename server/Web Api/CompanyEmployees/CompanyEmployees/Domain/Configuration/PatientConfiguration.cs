
using CompanyEmployees.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CompanyEmployees.Domain.Configuration
{
    public class PatientConfiguration : IEntityTypeConfiguration<PatientEntity>
    {
        public void Configure(EntityTypeBuilder<PatientEntity> builder)
        {
            builder.ToTable("Patient");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.UserManagerId);
            builder.Property(x => x.Gender);
            builder.HasOne(x => x.UserManager).WithMany(x => x.Patients).HasForeignKey(x => x.UserManagerId);
            builder.Property(x => x.Allergies);
            builder.Property(x => x.Medicalhistory);
            builder.Property(x => x.Healthinsurance);
            builder.Property(x => x.Height);
            builder.Property(x => x.Weight);
            builder.Property(x => x.YearOfBirth);
        }
    }
}
