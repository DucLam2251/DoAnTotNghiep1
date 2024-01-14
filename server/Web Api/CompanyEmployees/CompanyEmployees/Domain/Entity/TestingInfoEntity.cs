using CompanyEmployees.Build.Domain;
using CompanyEmployees.Common.EntityBase;

namespace CompanyEmployees.Domain.Entity
{
    public class TestingInfoEntity : EntityBase<Guid>, IEntityBase<Guid>
    {
        public Guid DepartmentId { get; set; }
        public virtual DepartmentEntity Department { get; set; }
        public string Name { get; set; }
        public float Price { get; set; }
        public float HealthInsurancePayments { get; set; }
        public string Description { get; set; }
        public bool isExaminationService { get; set; }
        public virtual List<AppointmentEntity> Appointments { get; set; }
        public virtual List<TestAppointmentEntity> TestingAppointments { get; set; }
    }
}
