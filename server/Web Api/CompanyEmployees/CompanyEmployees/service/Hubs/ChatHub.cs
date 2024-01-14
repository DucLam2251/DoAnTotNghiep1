using CompanyEmployees.Common.Common.Middleware;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Service.Interface;
using Microsoft.AspNetCore.SignalR;
using SignalRSwaggerGen.Attributes;

namespace CompanyEmployees.Service.Hubs
{
    [SignalRHub]
    public class ChatHub : Hub
    {
        public ChatHub()
        {
            
        }
    }
}

