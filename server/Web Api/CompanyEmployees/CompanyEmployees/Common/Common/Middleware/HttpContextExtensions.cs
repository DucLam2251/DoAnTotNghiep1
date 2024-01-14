namespace CompanyEmployees.Common.Common.Middleware
{
    public static class HttpContextExtensions
    {
        private const string UserIdKey = "id";

        public static void SetUserId(this HttpContext context, Guid userId)
        {
            context.Items[UserIdKey] = userId;
        }

        public static Guid GetAccountId(this HttpContext context)
        {
            if (context.Items.ContainsKey(UserIdKey) && context.Items[UserIdKey] is Guid userId)
            {
                return userId;
            }
            else
            {
                throw new ArgumentException();
            }
        }
    }
}
