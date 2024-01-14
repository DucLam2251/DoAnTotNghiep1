using CompanyEmployees.Build.Common.Interfaces;
using CompanyEmployees.Domain.Entity;

namespace CompanyEmployees.service.Repository.IRepository
{
    public interface IMedicineRepositoty : IRepositoryBaseAsync<MedicineEntity, Guid>
    {
    }
}