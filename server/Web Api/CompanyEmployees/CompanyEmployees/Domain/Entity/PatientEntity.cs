using CompanyEmployees.Build.Domain;
using CompanyEmployees.Common.EntityBase;
using CompanyEmployees.Domain.Enum;

namespace CompanyEmployees.Domain.Entity
{
    public class PatientEntity : EntityBase<Guid>, IEntityBase<Guid>
    {
        public Guid UserManagerId { get; set; }
        public virtual User UserManager { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Allergies { get; set; }
        public string? Medicalhistory { get; set; }
        public string? Healthinsurance { get; set; }
        public GenderEnum Gender { get; set; }
        public float Height { get; set; }
        public float Weight { get; set; }
        public int YearOfBirth { get; set; }
        public virtual List<AppointmentEntity> Appointments { get; set; }
        public virtual List<TestAppointmentEntity> TestingAppointments { get; set; }
    }
}
