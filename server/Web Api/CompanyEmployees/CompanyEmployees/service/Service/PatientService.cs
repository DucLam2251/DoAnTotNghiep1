using AutoMapper;
using Common.Common.ActionResponse;
using CompanyEmployees.Build.Domain;
using CompanyEmployees.Common.Common.Respone;
using CompanyEmployees.Domain.Configuration.DTO;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.Enum;
using CompanyEmployees.Domain.RequestBody;
using CompanyEmployees.service.Context;
using CompanyEmployees.service.Interface;
using CompanyEmployees.service.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace CompanyEmployees.service.Service
{
    public class PatientService : IPatientService
    {
        private readonly IMapper _mapper;
        private readonly IPatientRepository _patientRepository;
        private readonly RepositoryContext _dbcontext;
        private readonly IAppointmentRepository _appointmentRepo;

        public PatientService(IPatientRepository patientRepository, IMapper mapper, RepositoryContext dbContext, IAppointmentRepository appointmentRepository) 
        {
            _mapper = mapper;
            _patientRepository = patientRepository;
            _appointmentRepo = appointmentRepository;
            _dbcontext = dbContext;
        }

        public async Task<ActionResponse<PatientDetailDTO>> AddPatientDetail(PatientDetailRequestBody requestBody, Guid userManagerId)
        {
            ActionResponse<PatientDetailDTO> result = new();
            try
            {
                var listPatient = await _patientRepository.FindByCondition(x => x.UserManagerId == userManagerId).CountAsync();
                if(listPatient >= 5)
                {
                    result.Success = false;
                    result.Message = "The number of patients is less than 5";
                    return result;
                }
                var entity = _mapper.Map<PatientEntity>(requestBody);
                entity.UserManagerId = userManagerId;
                var res = await _patientRepository.CreateAsync(entity);
                var dataRes = _mapper.Map<PatientDetailDTO>(requestBody);
                dataRes.UsermanagerId = userManagerId;
                dataRes.Id = res;
                result = CommonRespone.CommonResponse(EnumRespone.Success, dataRes);
                return result;
            }
            catch
            {
                result = CommonRespone.CommonResponse(EnumRespone.Exception, new PatientDetailDTO());
                return result;
            }

        }
        public async Task<ActionResponse<PatientDetailDTO>> GetPatientDetail(Guid PatientId, Guid ManagerId, bool ispatient)
        {
            //var entity =  _patientRepository.FindByCondition(x => x.Id == PatientId && x.UserManagerId == ManagerId).FirstOrDefault();
            var query = _patientRepository.FindAll(true).Where(x => x.Id == PatientId);
            if(ispatient)
            {
                query = query.Where(x => x.UserManagerId == ManagerId);
            }
            var dataQuery = await query.Select(x => new PatientDetailDTO()
            {
                Id = x.Id,
                LastName = x.LastName,
                Allergies = x.Allergies,
                Medicalhistory = x.Medicalhistory,
                Healthinsurance = x.Healthinsurance,
                Height = x.Height,
                Weight = x.Weight,
                YearOfBirth = x.YearOfBirth,
                Gender = x.Gender,
                UserManager = new UserDetailDTO
                {
                    LastName = x.UserManager.LastName,
                    PhoneNumber = x.UserManager.PhoneNumber,
                    Email = x.UserManager.Email,

                },
                appointmentListDTOs = new List<AppointmentListDTO>()
            }).FirstOrDefaultAsync();
            if(dataQuery is null)
            {
                return CommonRespone.CommonResponse(EnumRespone.Exception, dataQuery);

            }
            var queryAppointment = await _appointmentRepo
                .FindAll(true)
                .Where(x => x.PatientId == PatientId)
                .Include(x => x.MainTestingInfo)
                .Include(x => x.MainTestingInfo.Department)
                .Select(x => new AppointmentListDTO()
                {
                    Id = x.Id,
                    Status = x.Status,
                    NameOfMainTestingInfo = x.MainTestingInfo.Name,
                    ApointmentDate = x.ApointmentDate.ToLocalTime(),
                    Description = x.Description,
                    NameDepartment = x.MainTestingInfo.Department.Name,
                    PaymentTotal = x.PaymentTotal,
                }).ToListAsync();
            dataQuery.appointmentListDTOs = queryAppointment;
            return CommonRespone.CommonResponse(EnumRespone.Success, dataQuery);
        }
        public async Task<ActionResponse<PatientDetailDTO>> Update(PatientDetailRequestBody requestBody, Guid userManagerId)
        {
            ActionResponse<PatientDetailDTO> result = new();
            try
            {
                var entity = _mapper.Map<PatientEntity>(requestBody);
                entity.UserManagerId = userManagerId;
                await _patientRepository.UpdateAsync(entity);
                result.Success = true;
                result.Message = "Success";
                return result;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = $"{ex}";
                result.Data = null;
                return result;
            }
            
        }
        public async Task<ActionResponse<PatientDetailDTO>> Delete(Guid Id, Guid ManagerId)
        {
            ActionResponse<PatientDetailDTO> result = new();
            try
            {
                var patient = _patientRepository.FindByCondition(x => x.Id == Id).FirstOrDefault();
                if (patient == null)
                {
                    result = CommonRespone.CommonResponseFalse<PatientDetailDTO>("Patient is emty.");
                    return result;

                }
                await _patientRepository.DeleteAsync(patient);
                result.Success = true;
                result.Message = "Success";
                return (result);
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = $"{ex}";
                return (result);

            }
        }
        public async Task<ActionResponse<ResponeGetList<PatientDetailDTO>>> GetListPatients(Guid IdManager)
        {
            try
            {
                var listPatient = await _patientRepository.FindByCondition(X => X.UserManagerId == IdManager).ToListAsync();
                var res = listPatient.Any() ? _mapper.Map<List<PatientDetailDTO>>(listPatient) : new List<PatientDetailDTO>();
                var data = new ResponeGetList<PatientDetailDTO>()
                {
                    Total = res == null ? 0 : res.Count,
                    Values = res,
                };
                return CommonRespone.CommonResponse(EnumRespone.Success, data);
            }
            catch (Exception ex)
            {
                return CommonRespone.CommonResponse(EnumRespone.Failse, new ResponeGetList<PatientDetailDTO>()
                {
                    Total = 0,
                    Values = new List<PatientDetailDTO>()
                });
            }
        }
        public async Task<ActionResponse<ResponeGetList<ViewPatientListDto>>> GetListPatientsByAdmin(GetListRequestBody requestBody)
        {
            try
            {
                var listPatient = _patientRepository.FindAll(true);

                if(requestBody.searchKey is not null)
                {
                    listPatient = listPatient.Where(x => x.LastName.ToLower().Contains(requestBody.searchKey.ToLower()));
                }
                var count = await listPatient.CountAsync();

                listPatient = listPatient.Skip(requestBody.PageSize * (requestBody.PageNumber - 1))
                    .Take(requestBody.PageSize).Include(x => x.UserManager);
                var ViewListPatientDto = await listPatient.Select(x => new ViewPatientListDto()
                {
                    Id = x.Id,
                    Gender = x.Gender,
                    YearOfBirth = x.YearOfBirth,
                    lastName = x.LastName,
                    NameManage = x.UserManager.LastName,
                    PhoneNumber = x.UserManager.PhoneNumber,
                    Email = x.UserManager.Email,
                }).ToListAsync(); 
                var data = new ResponeGetList<ViewPatientListDto>()
                {
                    Total = count,
                    Values = ViewListPatientDto,
                };
                return CommonRespone.CommonResponse(EnumRespone.Success, data);
            }
            catch (Exception ex)
            {
                return CommonRespone.CommonResponse(EnumRespone.Failse, new ResponeGetList<ViewPatientListDto>()
                {
                    Total = 0,
                    Values = new List<ViewPatientListDto>()
                });
            }
        }
    }
}
