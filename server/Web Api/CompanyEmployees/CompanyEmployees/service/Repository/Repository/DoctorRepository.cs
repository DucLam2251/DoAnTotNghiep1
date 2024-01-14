using CompanyEmployees.Build.Common.Interfaces;
using CompanyEmployees.Build.Infratructure;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.service.Context;
using CompanyEmployees.service.Repository.IRepository;

namespace CompanyEmployees.service.Repository.Repository
{
    public class DoctorRepository : RepositoryBaseAsync<DoctorEntity, Guid, RepositoryContext>, IDoctorRepository
    {

        public DoctorRepository(RepositoryContext dbContext, IUnitOfWork<RepositoryContext> unitOfWork) : base(dbContext, unitOfWork)
        {

        }

    }
}
