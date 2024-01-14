using CompanyEmployees.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CompanyEmployees.Domain.Configuration
{
    public class AppointmentConfiguration : IEntityTypeConfiguration<AppointmentEntity>
    {
        public void Configure(EntityTypeBuilder<AppointmentEntity> builder)
        {
            builder.ToTable("Apointment");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.DoctorId);
            builder.HasOne(x => x.Doctor).WithMany(x => x.Appointments).HasForeignKey(x => x.DoctorId);
            builder.Property(x => x.PatientId);
            builder.HasOne(x => x.Patient).WithMany(x => x.Appointments).HasForeignKey(x => x.PatientId);
            builder.Property(x => x.MainTestingInfoId);
            builder.HasOne(x => x.MainTestingInfo).WithMany(x => x.Appointments).HasForeignKey(x => x.MainTestingInfoId);
            builder.Property(x => x.TestAppointmentIds);
            builder.Property(x => x.ApointmentDate);
            builder.Property(x => x.HeartRate);
            builder.Property(x => x.Glucozo);
            builder.Property(x => x.BloodPressureSystolic);
            builder.Property(x => x.BloodPressureDiatolic);
            builder.Property(x => x.Temperature);
            builder.Property(x => x.Status);
            builder.Property(x => x.Medicines);
            builder.Property(x => x.StartDate);
            builder.Property(x => x.EndDate);
            builder.Property(x => x.Description);
            builder.Property(x => x.ConcusionFromDoctor);
            builder.Property(x => x.Index);
            builder.Property(x => x.PaymentTotal);

        }
    }
}
