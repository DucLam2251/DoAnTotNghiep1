namespace CompanyEmployees.Domain.RequestBody
{
    public class ChatRequestBody
    {
    }

    public class SendMessage
    {
        public Guid ReceivedId { get; set; }
        public string Message { get; set; }
    }

    public class GetMessages
    {
        public Guid PartnerId { get; set; }
    }
}
