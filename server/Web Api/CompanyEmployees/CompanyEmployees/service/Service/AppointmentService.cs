using AutoMapper;
using Common.Common.ActionResponse;
using CompanyEmployees.Common.Common.Respone;
using CompanyEmployees.Domain.Configuration.DTO;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.Enum;
using CompanyEmployees.Domain.RequestBody;
using CompanyEmployees.service.Context;
using CompanyEmployees.service.Interface;
using CompanyEmployees.service.Repository.IRepository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Xml;

namespace CompanyEmployees.service.Service
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IMapper _mapper;
        private readonly RepositoryContext _dbcontext;
        private readonly UserManager<User> _userManager;
        private readonly IAppointmentRepository _appointmentRepo;
        private readonly ITestingInfoRepository _testInfoRepo;
        private readonly ITestAppointmentService _testTestAppointmentService;
        private readonly IMedicineRepositoty _medicineRepositoty;
        private readonly ITestAppointmentRepository _testApointmentRepo;
        private readonly IDoctorRepository _doctorRepo;
        private readonly IPatientRepository _patientRepo;
        public AppointmentService
            (
            RepositoryContext dbcontext,
            IMapper mapper,
            UserManager<User> userManager,
            IAppointmentRepository appointmentRepository,
            ITestingInfoRepository testInfoRepo,
            ITestAppointmentService testTestAppointmentService,
            IMedicineRepositoty medicine,
            ITestAppointmentRepository testAppointmentRepository,
            IDoctorRepository doctorRepository,
            IPatientRepository patientRepo
            )
        {
            _appointmentRepo = appointmentRepository;
            _mapper = mapper;
            _dbcontext = dbcontext;
            _userManager = userManager;
            _testInfoRepo = testInfoRepo;
            _testTestAppointmentService = testTestAppointmentService; 
            _medicineRepositoty = medicine;
            _testApointmentRepo = testAppointmentRepository;
            _doctorRepo = doctorRepository;
            _patientRepo = patientRepo;
        }

        public async Task<ActionResponse<Guid>> CreateAppointment(CreateAppointmentRequestBody requestBody, RoleEnum RoleAccountCreate)
        {
            requestBody.ApointmentDate = requestBody.ApointmentDate.Date.AddHours(7).ToUniversalTime();

            var createAppointmentEntity = _mapper.Map<AppointmentEntity>(requestBody);
            if (RoleAccountCreate == RoleEnum.Patient)
            {
                createAppointmentEntity.Status = Domain.Enum.AppointmentStatusEnum.PendingConfirm;
            }
            else
            {
                createAppointmentEntity.Status = Domain.Enum.AppointmentStatusEnum.New;
            }

            var lastIndexInDay = await _appointmentRepo.FindAll(true)
              .Where(x => x.ApointmentDate < requestBody.ApointmentDate.AddDays(1)
              && x.ApointmentDate >= requestBody.ApointmentDate && x.MainTestingInfoId == requestBody.MainTestingInfoId)
              .OrderByDescending(x => x.Index)
              .Select(x => x.Index)
              .FirstOrDefaultAsync();
            if (lastIndexInDay == 0) createAppointmentEntity.Index = 1;
            else createAppointmentEntity.Index = lastIndexInDay + 1;

            var id = await _appointmentRepo.CreateAsync(createAppointmentEntity);
            var res = CommonRespone.CommonResponse(EnumRespone.Success, id);
            return res;
        }

        public async Task<ActionResponse<Guid>> UpdateStatus(UpdateAppointmentStatusRequestBody requestBody, Guid userId)
        {
            
            var appointmentEntity = await _appointmentRepo.FindAll(true)
                .Where(x => x.Id == requestBody.appointmentID)
                .Include(x => x.MainTestingInfo)
                .FirstOrDefaultAsync();

            if (appointmentEntity is null)
            {
                return CommonRespone.CommonResponseFalse<Guid>("Appointment is null");
            }
            if (!CheckStatus(appointmentEntity.Status, requestBody.newStatus))
            {
                return CommonRespone.CommonResponseFalse<Guid>("Status can't update");
            }
            appointmentEntity.Status = requestBody.newStatus;
            if (requestBody.newStatus == AppointmentStatusEnum.Inprogress)
            {
                var doctorID = await _doctorRepo.FindAll(true).Where(x => x.UserId == userId).Select(x => x.Id).FirstOrDefaultAsync();
                appointmentEntity.StartDate = DateTime.Now.AddHours(8).ToUniversalTime();
                appointmentEntity.DoctorId = doctorID;
            }
            if (requestBody.newStatus == AppointmentStatusEnum.Success)
            {
                appointmentEntity.EndDate = DateTime.Now.AddHours(8).ToUniversalTime();
                appointmentEntity.PaymentTotal = (await AppointmentPayment(requestBody.appointmentID, requestBody.HealthInsurance)).Data;
            }
            await _appointmentRepo.UpdateAsync(appointmentEntity);
            return CommonRespone.CommonResponse(EnumRespone.Success, appointmentEntity.Id);
        }

        public async Task<ActionResponse<AppointmentDTO>> GetDetailAppointment(Guid IdAppointment)
        {
            var appointmentEntity = await _appointmentRepo.FindAll(true)
                .Where(x => x.Id == IdAppointment).ToListAsync();

            var Appointment = await _appointmentRepo.FindAll(true)
                .Where(x => x.Id == IdAppointment)
                .Include(x => x.Patient)
                .Include(x => x.Doctor)
                .Include(x => x.MainTestingInfo)
                .Include(x => x.TestingAppointmens)
                .Select(x => new AppointmentDTO()
                {
                    Id = x.Id,
                    DoctorId = x.DoctorId,
                    PatientId = x.PatientId,
                    ApointmentDate = x.ApointmentDate,
                    Status = x.Status,
                    HeartRate = x.HeartRate,
                    Glucozo = x.Glucozo,
                    BloodPressureDiatolic = x.BloodPressureDiatolic,
                    BloodPressureSystolic = x.BloodPressureSystolic,
                    Temperature = x.Temperature,
                    Medicines = x.Medicines,
                    StartDate = x.StartDate != null ? x.StartDate.Value : (DateTime?)null,
                    EndDate = x.EndDate != null ? x.EndDate.Value : (DateTime?)null,
                    MainTestingInfoId = x.MainTestingInfoId,
                    Index = x.Index,
                    Description = x.Description,
                    ConcusionFromDoctor = x.ConcusionFromDoctor,
                    Doctor = x.DoctorId == null ? null : new DoctordetailDTO()
                    {
                        Id = x.Doctor!.Id,
                        Avatar = x.Doctor.User.Avatar,
                        FirstName = x.Doctor.User!.FirstName,
                        LastName = x.Doctor.User!.LastName,
                        DoctorInfor = new DoctorDTO()
                        {
                            Position = (EnumPosition)x.Doctor.Position,
                            Rank = (EnumRank)x.Doctor.Rank,
                        },
                        UserId = x.Doctor.UserId,
                    },
                    Patient = new PatientDetailDTO
                    {
                        Id = x.PatientId,
                        FirstName = x.Patient.FirstName,
                        LastName = x.Patient.LastName,
                        YearOfBirth = x.Patient.YearOfBirth,
                        Healthinsurance = x.Patient.Healthinsurance
                    },
                    MainTestingInfo = new TestingInfoDTO()
                    {
                        Id = x.MainTestingInfoId,
                        Name = x.MainTestingInfo.Name,
                        Price = x.MainTestingInfo.Price,
                        HealthInsurancePayments = (int)x.MainTestingInfo.HealthInsurancePayments,
                        Department = new DepartmentDTO()
                        {
                            Name = x.MainTestingInfo.Department.Name,
                        },
                        Description = x.MainTestingInfo.Description
                    },
                    TestAppointmentIds = x.TestAppointmentIds,
                    PaymentTotal = x.PaymentTotal,
                })
                .FirstAsync();
            if (!Appointment.Medicines.IsNullOrEmpty())
            {
                Appointment.MedicineDTO = _mapper.Map<List<MedicineInAppointmentDTO>> (Appointment.Medicines);
            }
        
            if(Appointment.TestAppointmentIds is not null && Appointment.TestAppointmentIds.Any())
            {
                var testAppointmentDTOs = _testApointmentRepo
                    .FindAll(true)
                    .Where(x => Appointment.TestAppointmentIds.Contains(x.Id))
                    .Include(x => x.TestingInfo)
                    .Select(x => new TestAppointmentDTO()
                    {
                        Id = x.Id,
                        Description = x.Description,
                        Image = x.Image,
                        TestingInfo = new TestingInfoDTO()
                        {
                            Id = x.TestingInfo.Id,
                            Name = x.TestingInfo.Name,
                            Price = x.TestingInfo.Price,
                            HealthInsurancePayments = (int)x.TestingInfo.HealthInsurancePayments,
                            Description = x.TestingInfo.Description
                        },
                        ConcusionFromDoctor = x.ConcusionFromDoctor,
                        Status = x.Status,
                        DateCreate = x.DateTime,
                        Index = x.Index
                    })
                    .ToList();
                Appointment.TestingAppointmens = testAppointmentDTOs;
            }
            return CommonRespone.CommonResponse(EnumRespone.Success, Appointment);

        }
        public async Task<ActionResponse<AppointmentEntity>> UpdateAppointment(UpdateHealthAppointmentRequestBody requestBody)
        {
            var updateAppointmentEntity = _mapper.Map<AppointmentEntity>(requestBody);
            var Appointment = await _appointmentRepo.GetByIdAsync(requestBody.Id);
            if (Appointment is null)
            {
                return CommonRespone.CommonResponseFalse<AppointmentEntity>("Appointment is emty");
            }
            if (Appointment.Status != AppointmentStatusEnum.Inprogress && Appointment.Status != AppointmentStatusEnum.OnBoard)
            {
                return CommonRespone.CommonResponseFalse<AppointmentEntity>("Appointment status is incorrect");
            }
            FunctionCommon.CopyNonNullProperties(updateAppointmentEntity, Appointment);
            //if (!requestBody.Medicines.IsNullOrEmpty())
            //{

            //}
            await _appointmentRepo.UpdateAsync(Appointment);
            return CommonRespone.CommonResponse(EnumRespone.Success, Appointment);
        }
        public async Task<ActionResponse<ResponeGetList<AppointmentListDTO>>> getList(GetListAppointments requestBody, Guid UserId, bool isPatient )
        {
            var startTime = requestBody.DateTime.Date.ToUniversalTime();
            var endTime = startTime.AddDays(1);
            var listAppointmentRequest = _appointmentRepo.FindAll(true);
            if (!isPatient)
            {
                if(requestBody.Status != AppointmentStatusEnum.OnBoard)
                {
                    listAppointmentRequest = listAppointmentRequest.Where(x => x.ApointmentDate <= endTime && x.ApointmentDate >= startTime);
                }

            }
            else
            {
                var listPatient = await _patientRepo.FindAll(true).Where(x => x.UserManagerId == UserId).Select(x => x.Id).ToListAsync();
                listAppointmentRequest =  listAppointmentRequest.Where(x => listPatient.Contains(x.PatientId));
            }
            if (requestBody.mainTestId is not null) listAppointmentRequest = listAppointmentRequest.Where(x => x.MainTestingInfoId == requestBody.mainTestId);
            if (requestBody.Status is not null)
            {
                if (requestBody.Status == AppointmentStatusEnum.New)
                {
                    if (isPatient)
                    {
                        listAppointmentRequest = listAppointmentRequest.Where(x =>  x.Status != AppointmentStatusEnum.PendingConfirm);
                    }
                    else
                    {
                        listAppointmentRequest = listAppointmentRequest.Where(x => x.Status == AppointmentStatusEnum.New || x.Status == AppointmentStatusEnum.Inprogress);
                    }
                }
                else
                {
                    listAppointmentRequest = listAppointmentRequest.Where(x => x.Status == requestBody.Status);
                }
            }
            var total = await listAppointmentRequest.CountAsync();
            listAppointmentRequest = listAppointmentRequest
                //.Where(x => x.Id == IdAppointment)
                .Include(x => x.Patient)
                .Include(x => x.MainTestingInfo);
            if (isPatient)
            {
                listAppointmentRequest = listAppointmentRequest.OrderByDescending(x => x.ApointmentDate);
            }
            else
            {
                listAppointmentRequest = listAppointmentRequest.OrderBy(x => x.Status)
                .ThenBy(x => x.Index);
            }
            var listAppointment = await listAppointmentRequest
                .Skip(requestBody.PageSize * (requestBody.PageNumber - 1))
                .Take(requestBody.PageSize)
                .Select(x => new AppointmentListDTO()
                {
                    Id = x.Id,
                    DoctorId = x.DoctorId,
                    PatientId = x.PatientId,
                    ApointmentDate = x.ApointmentDate.ToLocalTime(),
                    Status = x.Status,
                    StartDate = x.StartDate != null ? x.StartDate.Value : (DateTime?)null,
                    EndDate = x.EndDate != null ? x.EndDate.Value : (DateTime?)null,
                    MainTestingInfoId = x.MainTestingInfoId,
                    Index = x.Index,
                    LastName = x.Patient.LastName,
                    YearOfBirth = x.Patient.YearOfBirth,
                    NameOfMainTestingInfo = x.MainTestingInfo.Name,
                    Gender = x.Patient.Gender,
                }).ToListAsync();
            var res = new ResponeGetList<AppointmentListDTO>()
            {
                Total = total,
                Values = listAppointment,
            };
            return CommonRespone.CommonResponse(EnumRespone.Success, res);
        }
        public async Task<ActionResponse<ResponeGetList<AppointmentListDTO>>> getListByPatient(GetListAppointmentsByPatient requestBody, Guid UserId)
        {

            var listAppointmentRequest = _appointmentRepo.FindAll(true);
            if (requestBody.mainTestId is not null) listAppointmentRequest = listAppointmentRequest.Where(x => x.MainTestingInfoId == requestBody.mainTestId);
            if(requestBody.PatienId is not null)
            {
                listAppointmentRequest = listAppointmentRequest.Where(x => x.PatientId == requestBody.PatienId);
            }
            else
            {
                var listPatient = await _patientRepo.FindAll(true).Where(x => x.UserManagerId == UserId).Select(x => x.Id).ToListAsync();
                if (listPatient.IsNullOrEmpty())
                {
                    var res1 = new ResponeGetList<AppointmentListDTO>()
                    {
                        Total = 0,
                        Values = new List<AppointmentListDTO>(),
                    };
                    return CommonRespone.CommonResponse(EnumRespone.Success, res1);
                }
                listAppointmentRequest = listAppointmentRequest.Where(x => listPatient.Contains(x.PatientId));
            }
            if (requestBody.Status is not null)
            {
                listAppointmentRequest = listAppointmentRequest.Where(x => x.Status == requestBody.Status);
            }
            var total = await listAppointmentRequest.CountAsync();
            var listAppointment = await listAppointmentRequest
                //.Where(x => x.Id == IdAppointment)
                .Include(x => x.Patient)
                .Include(x => x.MainTestingInfo)
                .OrderBy(x => x.ApointmentDate)
                .ThenBy(x => x.Index)
                .Select(x => new AppointmentListDTO()
                {
                    Id = x.Id,
                    DoctorId = x.DoctorId,
                    PatientId = x.PatientId,
                    ApointmentDate = x.ApointmentDate.ToLocalTime(),
                    Status = x.Status,
                    StartDate = x.StartDate != null ? x.StartDate.Value : (DateTime?)null,
                    EndDate = x.EndDate != null ? x.EndDate.Value : (DateTime?)null,
                    MainTestingInfoId = x.MainTestingInfoId,
                    Index = x.Index,
                    LastName = x.Patient.LastName,
                    YearOfBirth = x.Patient.YearOfBirth,
                    NameOfMainTestingInfo = x.MainTestingInfo.Name,
                    Gender = x.Patient.Gender
                }).ToListAsync();
            var res = new ResponeGetList<AppointmentListDTO>()
            {
                Total = total,
                Values = listAppointment,
            };
            return CommonRespone.CommonResponse(EnumRespone.Success, res);
        }
        public async Task<ActionResponse<TestAppointmentDTO>> AddTestAppointment(AddTestAppointmentRequestBody requestBody)
        {
            var DataCreate = await _testTestAppointmentService.Create(requestBody.testAppointmentCreate);
            var AppointmentEntity = await _appointmentRepo.GetByIdAsync(requestBody.Id);
            if (AppointmentEntity is null) return CommonRespone.CommonResponseFalse<TestAppointmentDTO>("Appointment is null");
            if (AppointmentEntity.TestAppointmentIds is null)
            {
                AppointmentEntity.TestAppointmentIds = new List<Guid> { DataCreate.Data };
            }
            else
            {
                AppointmentEntity.TestAppointmentIds.Add(DataCreate.Data);
            }
            await _appointmentRepo.UpdateAsync(AppointmentEntity);
            var res = _mapper.Map<TestAppointmentDTO>(requestBody.testAppointmentCreate);
            res.Status = AppointmentStatusEnum.New;
            res.Id = DataCreate.Data;
            return CommonRespone.CommonResponse(EnumRespone.Success, res);
        }
        public async Task<ResponeGetList<AddTestAppointmentRequestBody>> AddListTestAppointment(List<AddTestAppointmentRequestBody> requestBody)
        {
            var listAddApointment = new List<Guid>();
            var ListAdd = new List<AddTestAppointmentRequestBody>();
            foreach (var x in requestBody)
            {
                var createTestApp = await _testTestAppointmentService.Create(x.testAppointmentCreate);
                ListAdd.Add(x);
                listAddApointment.Add(createTestApp.Data);
            }
            var AppointmentEntity = await _appointmentRepo.GetByIdAsync(requestBody[0].Id);
            if (AppointmentEntity.TestAppointmentIds is null)
            {
                AppointmentEntity.TestAppointmentIds = listAddApointment;
            }
            else
            {
                AppointmentEntity.TestAppointmentIds.AddRange(listAddApointment);
            }
            await _appointmentRepo.UpdateAsync(AppointmentEntity);
            var res = new ResponeGetList<AddTestAppointmentRequestBody>()
            {
                Total = ListAdd.Count,
                Values = ListAdd,
            };
            return res;
        }
        public async Task<ActionResponse<float>> AppointmentPayment(Guid id, bool HealthInsurance)
        {
            var appointment = await _appointmentRepo
                .FindAll(true)
                .Where(x => x.Id == id)
                .Select(x => new AppointmentDTO()
                {
                    Medicines = x.Medicines,
                    MainTestingInfoId = x.MainTestingInfoId,
                    TestAppointmentIds = x.TestAppointmentIds
                }).FirstOrDefaultAsync();
            if (appointment == null)
            {
                return CommonRespone.CommonResponseFalse<float>("appointment is nulll");
            }
            var listMed = _mapper.Map<List<Medicine>>(appointment.Medicines);
            float pay = 0;
            if (!appointment.Medicines.IsNullOrEmpty())
            {
                pay += await MedicinePayment(listMed, HealthInsurance);
            }
            var listTestInfoId = new List<Guid>
            {
                (Guid)appointment.MainTestingInfoId
            };
            if (!appointment.TestAppointmentIds.IsNullOrEmpty())
            {
                var listTestInfo = await _testApointmentRepo
                    .FindAll(true)
                    .Where(x => appointment.TestAppointmentIds.Contains(x.Id))
                    .Select(x => x.TestingInfo.Id)
                    .ToListAsync();
                listTestInfoId.AddRange(listTestInfo);
            }
            pay += (int)(await _testTestAppointmentService.TestPayment(listTestInfoId, HealthInsurance)).Data;
            return CommonRespone.CommonResponse(EnumRespone.Success, pay);

        }
        private async Task<int> MedicinePayment(List<Medicine> listMedicine, bool HealthInsurance)
        {
            var medicines = await _medicineRepositoty
                .FindAll(true)
                .Where(x => listMedicine.Select(x => x.Id).Contains(x.Id))
                .Select(x => new MedicineDTO
                {
                    Id = x.Id,
                    HealthInsurancePayments = x.HealthInsurancePayments,
                    Price = x.Price
                })
                .ToListAsync();
            float count = 0;
            if (HealthInsurance)
            {
                foreach (var item in medicines)
                {
                    try
                    {
                        var numberOfMed = listMedicine.FirstOrDefault(x => x.Id == item.Id).NumberOfMedicine;
                        count += ((100 - item.HealthInsurancePayments) * (int)item.Price / 100) * numberOfMed;
                    }
                    catch
                    {
                        continue;
                    }
                }
            }
            else
            {
                foreach (var item in medicines)
                {
                    var numberOfMed = listMedicine.FirstOrDefault(x => x.Id == item.Id).NumberOfMedicine;

                    count += item.Price * numberOfMed;
                }
            }
            return (int)count;
        }
        private bool CheckStatus(AppointmentStatusEnum? OldStatus, AppointmentStatusEnum NewStatus) 
        {
            switch (NewStatus)
            {
                case AppointmentStatusEnum.PendingConfirm:
                    return false;
                case AppointmentStatusEnum.Reject:
                    return OldStatus == AppointmentStatusEnum.PendingConfirm || OldStatus == AppointmentStatusEnum.New;
                case AppointmentStatusEnum.New:
                    return OldStatus == AppointmentStatusEnum.PendingConfirm;
                case AppointmentStatusEnum.Inprogress:
                    return OldStatus == AppointmentStatusEnum.New;
                case AppointmentStatusEnum.OnBoard:
                    return OldStatus == AppointmentStatusEnum.Inprogress;
                case AppointmentStatusEnum.Success:
                    return OldStatus == AppointmentStatusEnum.Inprogress || OldStatus == AppointmentStatusEnum.OnBoard;
            }
            return false;
        }
    }
}
