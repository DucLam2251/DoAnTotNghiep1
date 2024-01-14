using CompanyEmployees.Build.Domain;
using CompanyEmployees.Common.EntityBase;
using CompanyEmployees.Domain.Enum;
using System.ComponentModel.DataAnnotations.Schema;

namespace CompanyEmployees.Domain.Entity
{
    public class AppointmentEntity : EntityBase<Guid>, IEntityBase<Guid>
    {
        public Guid? DoctorId { get; set; }
        public virtual DoctorEntity? Doctor { get; set; }
        public Guid PatientId { get; set; }
        public virtual PatientEntity Patient { get; set; }
        public DateTimeOffset ApointmentDate { get; set; }
        public AppointmentStatusEnum? Status { get; set; }
        public float? HeartRate { get; set; }
        public float? Glucozo { get; set; }
        public float? BloodPressureDiatolic { get; set; }
        public float? BloodPressureSystolic { get; set; }
        public float? Temperature { get; set; }
        [Column(TypeName = "jsonb")]
        public List<Medicine>? Medicines { get; set; }
        public DateTimeOffset? StartDate { get; set; }
        public DateTimeOffset? EndDate { get; set; }
        public Guid MainTestingInfoId { get; set; }
        public virtual TestingInfoEntity MainTestingInfo { get; set; }
        public List<Guid>? TestAppointmentIds { get; set; }
        public virtual List<TestAppointmentEntity>? TestingAppointmens { get; set; }
        public int Index { get; set; }
        public string? Description { get; set; }
        public string? ConcusionFromDoctor { get; set; }
        public float PaymentTotal { get; set; }

    }

    public class Medicine
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public float Price { get; set; }
        public int HealthInsurancePayments { get; set; }
        public string? Description { get; set; }
        public int NumberOfMedicine { get; set; }
    }
}
