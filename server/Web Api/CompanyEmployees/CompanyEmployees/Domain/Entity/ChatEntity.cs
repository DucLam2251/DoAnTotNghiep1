using CompanyEmployees.Build.Domain;
using CompanyEmployees.Common.EntityBase;

namespace CompanyEmployees.Domain.Entity
{
    public class ChatEntity : EntityBase<Guid>, IEntityBase<Guid>
    {
        public Guid SendId { get; set; }
        public virtual User Sender { get; set; }
        public Guid ReceivedId { get; set; }
        public virtual User Receiver { get; set; }
        public DateTimeOffset CreateTime { get; set; }
        public string Message { get; set; }
    }
}
