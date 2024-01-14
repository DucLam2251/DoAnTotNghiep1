using CompanyEmployees.Build.Domain;
using CompanyEmployees.Common.EntityBase;

namespace CompanyEmployees.Domain.Entity
{
    public class MedicineEntity : EntityBase<Guid>, IEntityBase<Guid>
    {
        public string Title { get; set; }
        public float Price { get; set; }
        public int HealthInsurancePayments { get; set; }
        public string Description { get; set; }
    }
}
