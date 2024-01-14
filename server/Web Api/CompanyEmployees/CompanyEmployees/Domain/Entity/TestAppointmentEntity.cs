using CompanyEmployees.Build.Domain;
using CompanyEmployees.Common.EntityBase;
using CompanyEmployees.Domain.Enum;

namespace CompanyEmployees.Domain.Entity
{
    public class TestAppointmentEntity : EntityBase<Guid>, IEntityBase<Guid>
    {
        public Guid TestingInfoId { get; set; }
        public virtual TestingInfoEntity TestingInfo { get; set; }
        public string Description { get; set; }
        public string? Image { get; set; }
        public DateTimeOffset DateTime { get; set; }
        public string? ConcusionFromDoctor { get; set; }
        public AppointmentStatusEnum? Status { get; set; }
        public Guid PatientId { get; set; }
        public virtual PatientEntity Patient { get; set; }
        public Guid? DoctortId { get; set; }
        public virtual DoctorEntity? Doctor { get; set; }
        public int Index { get; set; } 
    }
}
