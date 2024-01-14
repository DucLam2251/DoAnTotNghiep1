using CompanyEmployees.Common.Common.Middleware;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.RequestBody;
using CompanyEmployees.service.Interface;
using CompanyEmployees.service.Service;
using CompanyEmployees.Service.Hubs;
using CompanyEmployees.Service.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace CompanyEmployees.Controllers
{
    [Route("api/chat")]
    [ApiController]
    public class ChatController : Controller
    {
        private readonly IHubContext<ChatHub> _chatHub;
        private readonly IChatService _chatService;
        public ChatController(IHubContext<ChatHub> chatHub, IChatService chatService)
        {
            _chatHub = chatHub;
            _chatService = chatService;
        }

        [HttpPost("Send")]
        //[Authorize(Roles = "Administrator")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessage requestBody)
        {
            var userId = HttpContext.GetAccountId();
            var res = await _chatService.SendMessage(userId, requestBody.ReceivedId, requestBody.Message);
            return Ok(res);
        }

        [HttpPost("Get")]
        //[Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetMessage([FromBody] GetMessages request)
        {
            var userId = HttpContext.GetAccountId();
            var res = await _chatService.GetAllMessages(userId, request.PartnerId);
            return Ok(res);
        }        
    }
}
