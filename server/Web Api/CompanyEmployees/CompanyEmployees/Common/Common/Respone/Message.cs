namespace CompanyEmployees.Common.Common.Respone
{
    public class Message
    {
        public static string GetMessage(EnumMessage messageEnum, string? title = null)
        {
            switch (messageEnum)
            {
                case EnumMessage.IsNull:
                    return $"{title} is null";
                case EnumMessage.Exception:
                    return "An error occurred while performing the operation.";
                case EnumMessage.Failse:
                    return "An error occurred while performing the operation.";
                case EnumMessage.Success:
                    return "Success!";
                default:
                    return "";
            }
        }
    }
    public enum EnumMessage
    {
        IsNull,
        Exception,
        Failse,
        Success
    }
}
