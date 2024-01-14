using CompanyEmployees.Build.Domain;
using CompanyEmployees.Common.EntityBase;
using CompanyEmployees.Domain.Enum;

namespace CompanyEmployees.Domain.Entity
{
    public class DoctorEntity : EntityBase<Guid>, IEntityBase<Guid>
    {
        public Guid UserId { get; set; }
        public virtual User User { get; set; }
        public Guid DepartmentId { get; set; }
        public virtual DepartmentEntity? Department { get; set; }
        public EnumRank? Rank { get; set; }
        public EnumPosition? Position { get; set; }
        public virtual List<AppointmentEntity> Appointments { get; set; }
        public virtual List<TestAppointmentEntity> TestingAppointments { get; set; }

    }
}
