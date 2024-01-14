using CompanyEmployees.Build.Domain;
using CompanyEmployees.Common.EntityBase;
using CompanyEmployees.Domain.Enum;

namespace CompanyEmployees.Domain.Entity
{
    public class DepartmentEntity : EntityBase<Guid>, IEntityBase<Guid>
    {
        public string Name { get; set; }
        public EnumDepartment Code { get; set; }
        public bool IsActive { get; set; }
        public virtual List<DoctorEntity> Doctors { get; set; }
        public virtual List<TestingInfoEntity> TestingInfos { get; set; }
    }
}
