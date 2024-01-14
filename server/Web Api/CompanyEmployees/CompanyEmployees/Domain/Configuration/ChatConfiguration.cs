using CompanyEmployees.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CompanyEmployees.Domain.Configuration
{
    public class ChatConfiguration : IEntityTypeConfiguration<ChatEntity>
    {
        public void Configure(EntityTypeBuilder<ChatEntity> builder)
        {
            builder.ToTable("Chat");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.CreateTime);
            builder.Property(x => x.SendId);
            builder.Property(x => x.ReceivedId);
            builder.Property(x => x.Message);
            builder.HasOne(x => x.Sender).WithMany(x => x.ChatsSend).HasForeignKey(x => x.SendId);
            builder.HasOne(x => x.Receiver).WithMany(x => x.ChatsReceived).HasForeignKey(x => x.ReceivedId);
        }
    }
}
