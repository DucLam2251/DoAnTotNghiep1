using AutoMapper;
using Common.Common.ActionResponse;
using CompanyEmployees.Common.Common.Respone;
using CompanyEmployees.Domain.Configuration;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.Enum;
using CompanyEmployees.Domain.RequestBody;
using CompanyEmployees.service.Context;
using CompanyEmployees.service.Interface;
using CompanyEmployees.service.Repository.IRepository;
using CompanyEmployees.service.Repository.Repository;
using CompanyEmployees.service.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;
using System.Security.Principal;

namespace CompanyEmployees.service.Controllers
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly RepositoryContext _repositoryContext;
        private readonly IDoctorRepository _doctorRepo;
        //private readonly IUserDetailRepository _userDetailRepository;
        public UserService(IMapper mapper, UserManager<User> userManager, RepositoryContext repositoryContext, IDoctorRepository doctorRepo)
        {
            _mapper = mapper;
            _repositoryContext = repositoryContext;
            _userManager = userManager;
            _doctorRepo = doctorRepo;
        }
        public async Task<ActionResponse> UpdateUserDetail(UserDetailRequestBody request, Guid idAccount)
        {
            var mainDetail = await _userManager.FindByIdAsync(idAccount.ToString());
            var addDetail = _mapper.Map<User>(request);
            FunctionCommon.CopyNonNullProperties(addDetail, mainDetail);
            //mainDetail.DateOfBirth = ()mainDetail.DateOfBirth;
            await _userManager.UpdateAsync(mainDetail);
            return CommonRespone.CommonResponse(EnumRespone.Success);
        }
        public async Task<ActionResponse<UserDetailDTO>> GetUserDetail(Guid Id)
        {
            try
            {
                var mainDetail = await _userManager.FindByIdAsync(Id.ToString());
                var res = _mapper.Map<UserDetailDTO>(mainDetail);

                    var doctorDetail = await _doctorRepo.FindByCondition(x => x.UserId == Id, true)
                        .Include(x => x.Department)
                        .Select(x => new DoctorDTO()
                        {
                            Position = (EnumPosition)x.Position,
                            DepartmentName = x.Department.Name,
                            Rank = (EnumRank)x.Rank,

                        })
                        .FirstOrDefaultAsync();
                    res.DoctorDTO = doctorDetail;
                
                //var res = new UserDetailDTO();
                if (res is null)
                {
                    return CommonRespone.CommonResponseFalse<UserDetailDTO>("User detail is null");
                }
                return CommonRespone.CommonResponse(EnumRespone.Success, res);

            }
            catch
            {
                return CommonRespone.CommonResponse(EnumRespone.Exception, new UserDetailDTO());

            }
        }
        public async Task<ActionResponse<ResponeGetList<UserDetailDTO>>> GetList(GetListRequestBody requestBody)
        {
            try
            {
                var role = new RoleId();
                var usersWithRole = from user in _userManager.Users
                                    join userRole in _repositoryContext.UserRoles 
                                    on user.Id equals userRole.UserId
                                    where userRole.RoleId == role.RoleIdPatient
                                    select user;
                //var listUserQuery = _userManager.Users;
                //var usersInRole = await _userManager.GetUsersInRoleAsync("Patient");
                //var listUser = new List<User>();
                if (!requestBody.searchKey.IsNullOrEmpty())
                {
                    usersWithRole = usersWithRole.Where(x => 
                    x.LastName.ToLower()!.Contains(requestBody.searchKey.ToLower()!) || 
                    x.Email.ToLower()!.Contains(requestBody.searchKey.ToLower()!));
                }

                var total = await usersWithRole.CountAsync();
                var listUser = await usersWithRole
                    .Skip(requestBody.PageSize * (requestBody.PageNumber - 1))
                    .Take(requestBody.PageSize).ToListAsync();

                var list = _mapper.Map<List<UserDetailDTO>>(listUser);

                var res = new ResponeGetList<UserDetailDTO>
                {
                    Total = total,
                    Values = list
                };
                return CommonRespone.CommonResponse(EnumRespone.Success, res);
            }
            catch
            {
                return CommonRespone.CommonResponse(EnumRespone.Exception, new ResponeGetList<UserDetailDTO>());

            }
        }

    }
}
