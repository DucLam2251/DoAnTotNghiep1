using AutoMapper;
using Common.Common.ActionResponse;
using CompanyEmployees.Build.Domain;
using CompanyEmployees.Common.Common.Respone;
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
using System.Data;
using CompanyEmployees.Domain.Configuration;
using CompanyEmployees.Domain.DTO;

namespace CompanyEmployees.service.Service
{

    public class DoctorService : IDoctorService
    {
        private readonly IMapper _mapper;

        //private readonly IUserDetailRepository _userDetailRepository;
        private readonly RepositoryContext _dbcontext;
        private readonly IDoctorRepository _doctorRepository;
        private readonly UserManager<User> _userManager;
        private readonly IDepartmentRepository _departmentRepo;
        private readonly RepositoryContext _repositoryContext;
        public DoctorService(RepositoryContext dbcontext, 
            IMapper mapper, 
            //IUserDetailRepository userDetailRepository, 
            IDoctorRepository doctorRepository,
            UserManager<User> userManager,
            IDepartmentRepository departmentRepository,
            RepositoryContext repositoryContext)
        {
            _dbcontext = dbcontext;
            _mapper = mapper;
            _doctorRepository = doctorRepository;
            _userManager = userManager;
            _repositoryContext = repositoryContext;
            _departmentRepo = departmentRepository;
            //_userDetailRepository = userDetailRepository;
        }

        public async Task<ActionResponse<Guid>> CreateAccountDoctor(CreateAccountDoctor doctorInfor)
        {
            var res = new ActionResponse<Guid>();
            try
            {
                var department = await _departmentRepo.FindByCondition(x => x.Id == doctorInfor.DepartmentId, true).CountAsync();
                if(department <= 0) return CommonRespone.CommonResponseFalse<Guid>("Department is null");
                var DoctorAddEntity = _mapper.Map<DoctorEntity>(doctorInfor);
                var userDetailEntity = _mapper.Map<User>(doctorInfor);
                var result = await _userManager.CreateAsync(userDetailEntity, doctorInfor.Password);
                await _userManager.AddToRoleAsync(userDetailEntity, RoleEnum.Doctor.ToString());

                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description);
                    return CommonRespone.CommonResponseFalse<Guid>(errors.FirstOrDefault());
                }
                var id = (await _userManager.FindByEmailAsync(doctorInfor.Email)).Id;
                DoctorAddEntity.UserId = id;
                DoctorAddEntity.Id = Guid.NewGuid();
                await _doctorRepository.CreateAsync(DoctorAddEntity);

                res = CommonRespone.CommonResponse(EnumRespone.Success, id);
                return res;
            }
            catch
            {
                res = CommonRespone.CommonResponse(EnumRespone.Exception, Guid.Empty);
                return res;
            }
        }

        public async Task<ActionResponse<DoctordetailDTO>> GetDoctorInfor(Guid id)
        {
            var res = new ActionResponse<DoctordetailDTO>();
            try
            {
                var doctorInforEntity = await _doctorRepository
                    .FindByCondition(x =>x.UserId == id)
                    .Include(d => d.User)
                    .Include(x => x.Department)
                    .Select(x => new DoctorEntity()
                    {
                        Id = x.Id,
                        //Appointments = x.Appointments,
                        UserId = x.UserId,
                        Position = x.Position,
                        Rank = x.Rank,
                        Department = new DepartmentEntity
                        {
                            Id = x.Id,
                            Name = x.Department.Name
                        },
                        User = new User
                        {
                            Id = x.User.Id,
                            FirstName = x.User.FirstName,
                            LastName = x.User.LastName,
                            Email = x.User.Email,
                            DateOfBirth = x.User.DateOfBirth != null ? x.User.DateOfBirth.Value.ToLocalTime() : (DateTime?)null,
                            Avatar = x.User.Avatar,
                            Gender = x.User.Gender,
                            Address = x.User.Address,
                            PhoneNumber = x.User.PhoneNumber
                        }
                    })
                    .FirstOrDefaultAsync();
                var doctor = _mapper.Map<DoctordetailDTO>(doctorInforEntity.User);
                doctor.DoctorInfor = _mapper.Map<DoctorDTO>(doctorInforEntity);
                //doctor.DoctorInfor = _mapper.Map<DoctorDTO>(doctorInforEntity);
                doctor.DoctorInfor.DepartmentName = doctorInforEntity.Department?.Name;
                res = CommonRespone.CommonResponse(EnumRespone.Success, doctor);
                return res;
            }
            catch
            {
                res = CommonRespone.CommonResponse(EnumRespone.Exception, new DoctordetailDTO());

                return res;
            }
        }
        public async Task<ActionResponse> UpdateDoctorByAdmin(UpdateDoctorByAdminRequestBody requesbody)
        {
            try
            {
                var oldDoctorInfor = await _doctorRepository
                    .FindByCondition(x => x.UserId == requesbody.Id).FirstOrDefaultAsync();
                var updateDoctorInfor = _mapper.Map<DoctorEntity>(requesbody);
                updateDoctorInfor.Id = Guid.Empty;
                FunctionCommon.CopyNonNullProperties(updateDoctorInfor, oldDoctorInfor);

                await _doctorRepository.UpdateAsync(oldDoctorInfor);
                return CommonRespone.CommonResponse(EnumRespone.Success);
            }
            catch
            {
                return CommonRespone.CommonResponse(EnumRespone.Exception);
            }
        }
        public async Task<ActionResponse<ResponeGetList<DoctorGetListDTO>>> GetListDoctor(DoctorInforRequestBody requestBody)
        {
            try
            {
                var listDoctor = new List<DoctordetailDTO>();
                var doctorInforQuery = _doctorRepository
                    .FindAll(true);
                if (requestBody.DepartmentId is not null) doctorInforQuery = doctorInforQuery.Where(x => x.DepartmentId == requestBody.DepartmentId);
                if (requestBody.Rank is not null) doctorInforQuery = doctorInforQuery.Where(x => x.Rank == requestBody.Rank);
                if (requestBody.Position is not null) doctorInforQuery = doctorInforQuery.Where(x => x.Position == requestBody.Position);
                var total = await doctorInforQuery.CountAsync();
                doctorInforQuery = doctorInforQuery.Include(d => d.User).Include(x => x.Department);
                if (!requestBody.searchKey.IsNullOrEmpty())
                {
                    doctorInforQuery = doctorInforQuery.Where(x =>
                    x.User.LastName!.Contains(requestBody.searchKey) ||
                    x.User.Email!.Contains(requestBody.searchKey));
                }
                doctorInforQuery = doctorInforQuery.Skip(requestBody.PageSize * (requestBody.PageNumber - 1))
                    .Take(requestBody.PageSize);
                var ListDoctorDTO = await doctorInforQuery.Select(x => new DoctorGetListDTO
                {
                    Id = x.Id,
                    //Appointments = x.Appointments,
                    UserId = x.UserId,
                    DepartmentId = x.DepartmentId,
                    Position = x.Position,
                    Rank = x.Rank,
                    LastName = x.User.LastName,
                    Avatar = x.User.Avatar,
                    Gender = x.User.Gender,
                    DepartmentName = x.Department.Name,
                    Email = x.User.Email
                }).ToListAsync();
                //var listDoctorEntity = await doctorInforQuery.ToListAsync();
                //foreach (var doctorEntity in listDoctorEntity)
                //{
                //    var doctorDetail = new DoctordetailDTO();
                //    doctorDetail = _mapper.Map<DoctordetailDTO>(doctorEntity.User);
                //    doctorDetail.DoctorInfor = _mapper.Map<DoctorDTO>(doctorEntity);
                //    listDoctor.Add(doctorDetail);
                //}
                var res = new ResponeGetList<DoctorGetListDTO>()
                {
                    Values = ListDoctorDTO,
                    Total = total,
                };
                return CommonRespone.CommonResponse(EnumRespone.Success, res);
            }
            catch(Exception ex)
            {
                return CommonRespone.CommonResponse(EnumRespone.Exception, new ResponeGetList<DoctorGetListDTO>());

            }
        }
    }
}
