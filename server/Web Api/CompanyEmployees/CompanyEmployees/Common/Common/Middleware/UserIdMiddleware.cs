using CompanyEmployees.Domain.Entity;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;

namespace CompanyEmployees.Common.Common.Middleware
{
    public class UserIdMiddleware
    {
        private readonly RequestDelegate _next;

        public UserIdMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IHttpContextAccessor httpContextAccessor)
        {
            var userIdClaim = context.User.Claims.FirstOrDefault(c => c.Type == "id");

            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out Guid userId))
            {
                context.SetUserId(userId);
            }
            // Cũng có thể thiết lập HttpContextAccessor để có thể truy cập HttpContext từ services 
            httpContextAccessor.HttpContext = context;

            await _next(context);
        }
    }
}
