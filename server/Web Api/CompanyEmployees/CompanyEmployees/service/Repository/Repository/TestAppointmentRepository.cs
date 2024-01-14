using CompanyEmployees.Build.Common.Interfaces;
using CompanyEmployees.Build.Infratructure;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.service.Context;
using CompanyEmployees.service.Repository.IRepository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CompanyEmployees.service.Repository.Repository
{
    public class TestAppointmentRepository : RepositoryBaseAsync<TestAppointmentEntity, Guid, RepositoryContext>, ITestAppointmentRepository
    {
        public TestAppointmentRepository(RepositoryContext dbContext, IUnitOfWork<RepositoryContext> unitOfWork) : base(dbContext, unitOfWork)
        {

        }
    }
}
