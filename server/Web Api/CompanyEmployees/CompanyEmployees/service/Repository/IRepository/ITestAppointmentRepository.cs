using CompanyEmployees.Build.Common.Interfaces;
using CompanyEmployees.Domain.Entity;

namespace CompanyEmployees.service.Repository.IRepository
{
    public interface ITestAppointmentRepository : IRepositoryBaseAsync<TestAppointmentEntity, Guid>
    {
    }
}