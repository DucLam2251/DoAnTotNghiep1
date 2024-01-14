using CompanyEmployees.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CompanyEmployees.Domain.Configuration
{
    public class TestAppointmentConfiguration : IEntityTypeConfiguration<TestAppointmentEntity>
    {
        public void Configure(EntityTypeBuilder<TestAppointmentEntity> builder)
        {
            builder.ToTable("TestAppointment");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Description);
            builder.Property(x => x.Image);
            builder.Property(x => x.DateTime);
            builder.Property(x => x.TestingInfoId);
            builder.HasOne(x => x.TestingInfo).WithMany(x => x.TestingAppointments).HasForeignKey(x => x.TestingInfoId);
            builder.Property(x => x.DoctortId);
            builder.HasOne(x => x.Doctor).WithMany(x => x.TestingAppointments).HasForeignKey(x => x.DoctortId);
            builder.Property(x => x.ConcusionFromDoctor);
            builder.Property(x => x.Status);
            builder.Property(x => x.PatientId);
            builder.HasOne(x => x.Patient).WithMany(x => x.TestingAppointments).HasForeignKey(x => x.PatientId);
        }
    }
}
