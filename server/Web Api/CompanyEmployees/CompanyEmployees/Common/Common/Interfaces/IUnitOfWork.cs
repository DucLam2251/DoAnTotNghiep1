using Microsoft.EntityFrameworkCore;


namespace CompanyEmployees.Build.Common.Interfaces
{
    public interface IUnitOfWork<TContext> : IDisposable where TContext : DbContext
    {
        Task<int> CommitAsync();
    }
}
