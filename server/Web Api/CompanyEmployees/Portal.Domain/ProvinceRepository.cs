using Common.Contract.Common.Interfaces;
using Common.Infrastructure.Common.Implements;
using Portal.Application.Repositories.Interfaces.Province;
using Portal.Application.Repositories.Interfaces.ReceptionStatus;
using Portal.Infrastructure.Datas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portal.Infrastructure.Repositories.Implements.Province
{
  public class ProvinceRepository : RepositoryBaseAsync<Portal.Domain.Entities.Province, Guid, ApplicationDbContext>, IProvinceRepository
  {
    public ProvinceRepository(ApplicationDbContext dbContext, IUnitOfWork<ApplicationDbContext> unitOfWork) : base(dbContext, unitOfWork)
    {

    }
  }
}
