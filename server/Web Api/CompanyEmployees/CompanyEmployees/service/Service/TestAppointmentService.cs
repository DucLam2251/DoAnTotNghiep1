using AutoMapper;
using Common.Common.ActionResponse;
using CompanyEmployees.Common.Common.Respone;
using CompanyEmployees.Controllers;
using CompanyEmployees.Domain.Configuration;
using CompanyEmployees.Domain.Configuration.DTO;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.Enum;
using CompanyEmployees.Domain.RequestBody;
using CompanyEmployees.service.Context;
using CompanyEmployees.service.Interface;
using CompanyEmployees.service.Repository.IRepository;
using CompanyEmployees.service.Repository.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PdfSharp.Fonts;
using System.Linq;
using static CompanyEmployees.Controllers.AppointmentController;

namespace CompanyEmployees.service.Service
{
    public class TestAppointmentService : ITestAppointmentService
    {
        private readonly IMapper _mapper;
        private readonly ITestAppointmentRepository _testApointmentRepo;
        private readonly ITestingInfoRepository _testInfoRepo;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IDoctorRepository _doctorRepo;
        public TestAppointmentService(IMapper mapper, 
            ITestAppointmentRepository testAppointmentRepo, 
            ITestingInfoRepository testInfoRepo, 
            IAppointmentRepository appointmentRepository,
            IPatientRepository patientRepository,
            IDoctorRepository doctorRepository)
        {
            _mapper = mapper;
            _testApointmentRepo = testAppointmentRepo;
            _testInfoRepo = testInfoRepo;
            _appointmentRepository = appointmentRepository;
            _patientRepository = patientRepository;
            _doctorRepo = doctorRepository;
        }

        public async Task<ActionResponse<Guid>> Create(CreateTestAppointmentRequestBody requestBody)
        {
            var testInfo = await _testInfoRepo.GetByIdAsync(requestBody.TestingInfoId);
            if (testInfo is null) return  CommonRespone.CommonResponseFalse<Guid>("testInfo is null");
            var newTestAppointmentEntity = _mapper.Map<TestAppointmentEntity>(requestBody);
            newTestAppointmentEntity.DateTime = DateTimeOffset.Now.AddHours(7).ToUniversalTime();
            var lastIndexInDay = await _testApointmentRepo.FindAll(true)
                .Where(x => x.DateTime < DateTimeOffset.UtcNow.Date.AddDays(1)
                && x.DateTime >= DateTimeOffset.UtcNow.Date && x.TestingInfoId == requestBody.TestingInfoId)
                .OrderByDescending(x => x.DateTime)
                .Select(x => x.Index)
                .FirstOrDefaultAsync();
            if(lastIndexInDay == 0) newTestAppointmentEntity.Index= 1;
            else newTestAppointmentEntity.Index = lastIndexInDay + 1;

            newTestAppointmentEntity.Status = AppointmentStatusEnum.New;
            var id = await _testApointmentRepo.CreateAsync(newTestAppointmentEntity);
            var res =  CommonRespone.CommonResponse(EnumRespone.Success, id);
            return res;
        }
        public async Task<ActionResponse<TestAppointmentEntity>> Submit(SubmitTestAppointmentRequestBody requestBody, Guid userId)
        {
            var testAppointment = await _testApointmentRepo.GetByIdAsync(requestBody.Id);
            if (testAppointment is null) return CommonRespone.CommonResponseFalse<TestAppointmentEntity>("testAppointment is null");
            else
            {
                testAppointment.Image = requestBody.LinkImage;
                testAppointment.ConcusionFromDoctor = requestBody.ConcusionFromDoctor;
                //testAppointment.Status = TestAppointmentStatusEnum.Success;
                //testAppointment.PatientId = requestBody.PatientId;
                testAppointment.Status = AppointmentStatusEnum.Success;
                var doctorId = await _doctorRepo.FindByCondition(x => x.UserId == userId, true).Select(x => x.Id).FirstOrDefaultAsync();
                testAppointment.DoctortId = doctorId;
            }
            await _testApointmentRepo.UpdateAsync
                (testAppointment);
            var res = CommonRespone.CommonResponse(EnumRespone.Success, testAppointment);
            return res;
        }
        public async Task<ActionResponse<TestAppointmentDTO>> GetTestAppointment(Guid Id)
        {
            var testAppointment = (await _testApointmentRepo.FindAll(true)
                .Where(x => x.Id == Id)
                .Include(x => x.TestingInfo)
                .Include(x => x.Patient)
                .Select(x => new TestAppointmentDTO()
                {
                    Id = x.Id,
                    Description = x.Description,
                    Image = x.Image,
                    ConcusionFromDoctor = x.ConcusionFromDoctor,
                    Status = x.Status,
                    DateCreate = x.DateTime,
                    Index= x.Index,
                    PatientDetail = new PatientDetailDTO()
                    {
                        Id= x.Patient.Id,
                        FirstName = x.Patient.FirstName,
                        LastName = x.Patient.LastName,
                        YearOfBirth = x.Patient.YearOfBirth,
                        Allergies = x.Patient.Allergies,
                        Medicalhistory = x.Patient.Medicalhistory,

                    },
                    DoctorId = x.DoctortId,
                    DoctordetailDTO = x.DoctortId == null ? null : new DoctordetailDTO
                    {
                        Id = x.Doctor.Id,
                        LastName = x.Doctor.User.LastName,
                        DoctorInfor = new DoctorDTO
                        {
                            Position = (EnumPosition)x.Doctor.Position,
                            Rank = (EnumRank)x.Doctor.Rank,
                        },
                        UserId = x.Doctor.UserId,
                    },
                    TestingInfo = new TestingInfoDTO()
                    {
                        Id = x.TestingInfo.Id,
                        Name = x.TestingInfo.Name,
                        Description = x.TestingInfo.Description
                    }
                })
                .FirstOrDefaultAsync());
            
            return CommonRespone.CommonResponse(EnumRespone.Success, testAppointment);
        }
        public async Task<ActionResponse<ResponeGetList<TestAppointmentDTO>>> GetListTestAppointment(GetListTestAppointmentRequestBody requestBody)
        {
            var startTime = requestBody.DateTime.Date.AddHours(7).ToUniversalTime();
            var endTime = startTime.AddDays(1);

            var listTestAppointmentEntity =  _testApointmentRepo.FindAll(true)
                .Where(x => x.DateTime <= endTime && x.DateTime >= startTime);
            if (requestBody.TestInfoId is not null) listTestAppointmentEntity = listTestAppointmentEntity.Where(x => x.TestingInfoId == requestBody.TestInfoId);
            if (requestBody.Status is not null) listTestAppointmentEntity = listTestAppointmentEntity.Where(x => x.Status == requestBody.Status);
            if (!requestBody.searchKey.IsNullOrEmpty())
            {
                listTestAppointmentEntity = listTestAppointmentEntity.Where(x =>  x.Patient.LastName.ToLower().Contains(requestBody.searchKey.ToLower()));
            }
            // query theo ngay
            listTestAppointmentEntity = listTestAppointmentEntity
                .OrderBy(x => x.Status)
                .ThenBy(x => x.Index)
                .Skip(requestBody.PageSize * (requestBody.PageNumber - 1))
                .Take(requestBody.PageSize);
            var total = await listTestAppointmentEntity.CountAsync();

            // order
            var listTestAppointmentDTOQuery = listTestAppointmentEntity
                .Select(x => new TestAppointmentDTO()
                {
                    Id = x.Id,
                    //Description = x.Description,
                    //Image = x.Image,
                    //ConcusionFromDoctor = x.ConcusionFromDoctor,
                    Status = x.Status,
                    DateCreate = x.DateTime,
                    Index = x.Index,
                    PatientDetail = new PatientDetailDTO()
                    {
                        Id = x.Patient.Id,
                        FirstName = x.Patient.FirstName,
                        LastName = x.Patient.LastName,
                        YearOfBirth = x.Patient.YearOfBirth,
                        //Allergies = x.Patient.Allergies,
                        //Medicalhistory = x.Patient.Medicalhistory,

                    },
                    TestingInfo = new TestingInfoDTO()
                    {
                        Id = x.TestingInfo.Id,
                        Name = x.TestingInfo.Name,
                        Description = x.TestingInfo.Description
                    }
                });
            var data = await listTestAppointmentDTOQuery.ToListAsync();

            var res = new ResponeGetList<TestAppointmentDTO>
            {
                Total = total,
                Values = data
            };
            return CommonRespone.CommonResponse(EnumRespone.Success, res);
        }
        public async Task<ActionResponse<int>> TestPayment(List<Guid> listTest, bool HealthInsurance)
        {
            if(!listTest.Any()) return CommonRespone.CommonResponse(EnumRespone.Success, 0);
            var result = await _testInfoRepo
                .FindAll(true)
                .Where(x => listTest.Contains(x.Id))
                .Select(x => new TestingInfoEntity()
                {
                    Price = x.Price,
                    HealthInsurancePayments = x.HealthInsurancePayments
                })
                .ToListAsync();
            float count = 0;
            if (HealthInsurance)
            {
                foreach (var item in result)
                {
                    count += ((100 - item.HealthInsurancePayments) * (int)item.Price / 100);
                }
            }
            else
            {
                foreach (var item in result)
                {
                    count += item.Price;
                }
            }
            return CommonRespone.CommonResponse(EnumRespone.Success, (int)count);
        }

        private async Task<PatientDetailDTO> GetPateintdetailFormTestAppointmentId(Guid Id)
        {
            //var idUser = _appointmentRepository.FindAll(true).Where(x => x.Testing.Contains(Id.ToString())).Select(x => x.PatientId);
            var idUser = Guid.NewGuid();
            var patientEntity = await _appointmentRepository.GetByIdAsync(idUser);
            var patientDTO = _mapper.Map<PatientDetailDTO>(patientEntity);
            return patientDTO;
        }
    }
}
