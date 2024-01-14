using AutoMapper;
using Common.Common.ActionResponse;
using CompanyEmployees.Build.Domain;
using CompanyEmployees.Common.Common.Respone;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.RequestBody;
using CompanyEmployees.service.Context;
using CompanyEmployees.service.Interface;
using CompanyEmployees.service.Repository.IRepository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Net;
using System.Numerics;
using CompanyEmployees.Common;
using System.Reflection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc.Formatters;
using Azure.Core;
using CompanyEmployees.Domain.Enum;
using CompanyEmployees.Service.Interface;
using CompanyEmployees.Service.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace CompanyEmployees.service.Service
{
    public class ChatService : IChatService
    {
        private readonly RepositoryContext _dbcontext;
        private readonly IHubContext<ChatHub> _chatHub;
        public ChatService(RepositoryContext dbcontext, IHubContext<ChatHub> chatHub)
        {
            _dbcontext = dbcontext;
            _chatHub = chatHub;
        }

        public async Task<bool> SendMessage(Guid sendId, Guid receiveId, string message)
        {
            try
            {
                await _dbcontext.AddAsync(new ChatEntity()
                {
                    Id = Guid.NewGuid(),
                    SendId = sendId,
                    ReceivedId = receiveId,
                    Message = message
                });
                await _chatHub.Clients.All.SendAsync("ReceivedMessage", receiveId, message);
                await _dbcontext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<List<ChatEntity>> GetAllMessages(Guid sendId, Guid receiveId)
        {
            List<ChatEntity> result = new();
            result.AddRange(await _dbcontext.Set<ChatEntity>().Where(x => (x.SendId == sendId && x.ReceivedId == receiveId) || (x.SendId == receiveId && x.ReceivedId == sendId)).OrderBy(x => x.CreateTime).ToListAsync());
            return result;
        }
    }
}
