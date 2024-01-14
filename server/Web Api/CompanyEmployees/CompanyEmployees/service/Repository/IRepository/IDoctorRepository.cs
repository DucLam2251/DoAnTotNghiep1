using CompanyEmployees.Build.Common.Interfaces;
using CompanyEmployees.Domain.Entity;

namespace CompanyEmployees.service.Repository.IRepository
{
    public interface IDoctorRepository : IRepositoryBaseAsync<DoctorEntity, Guid>
    {
    }
}