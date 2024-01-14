using CompanyEmployees.Build.Common.Interfaces;
using CompanyEmployees.Build.Infratructure;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.service.Context;
using CompanyEmployees.service.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace CompanyEmployees.service.Repository.Repository
{
    public class PatientRepository : RepositoryBaseAsync<PatientEntity, Guid, RepositoryContext>, IPatientRepository
    {

        public PatientRepository(RepositoryContext dbContext, IUnitOfWork<RepositoryContext> unitOfWork) : base(dbContext, unitOfWork)
        {
            
        }
   
    }
}
