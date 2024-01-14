using CompanyEmployees.Domain.Entity;

namespace CompanyEmployees.Service.Interface
{
    public interface IChatService
    {
        Task<bool> SendMessage(Guid sendId, Guid receiveId, string message);
        Task<List<ChatEntity>> GetAllMessages(Guid sendId, Guid receiveId);
    }
}
