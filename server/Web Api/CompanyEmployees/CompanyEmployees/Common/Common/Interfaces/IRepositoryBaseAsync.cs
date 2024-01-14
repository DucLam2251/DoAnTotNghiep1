using CompanyEmployees.Build.Domain;
using Microsoft.EntityFrameworkCore;

namespace CompanyEmployees.Build.Common.Interfaces
{
    public interface IRepositoryBaseAsync<T, K> : IRepositoryQueryBase<T, K>
       where T : EntityBase<K>
    {
        void Create(T entity);
        Task<K> CreateAsync(T entity);
        IList<K> CreateList(IEnumerable<T> entities);
        Task<IList<K>> CreateListAsync(IEnumerable<T> entities);
        void Update(T entity);
        Task UpdateAsync(T entity);
        void UpdateList(IEnumerable<T> entities);
        Task UpdateListAsync(IEnumerable<T> entities);
        void Delete(T entity);
        Task DeleteAsync(T entity);
        void DeleteList(IEnumerable<T> entities);
        Task DeleteListAsync(IEnumerable<T> entities);
        Task<int> SaveChangesAsync();
        Task EndTransactionAsync();
        Task RollbackTransactionAsync();
    }
    public interface IRepositoryBaseAsync<T, K, TContext> : IRepositoryBaseAsync<T, K>
       where T : EntityBase<K>
       where TContext : DbContext
    {

    }
}
