using CompanyEmployees.Build.Common.Interfaces;
using CompanyEmployees.Domain.Entity;

namespace CompanyEmployees.service.Repository.IRepository
{
    public interface ITestingInfoRepository : IRepositoryBaseAsync<TestingInfoEntity, Guid>
    {
    }
}