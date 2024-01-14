using AutoMapper;
using CompanyEmployees.Common.Common.Respone;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.RequestBody;
using CompanyEmployees.service.Repository.IRepository;
using CompanyEmployees.service.Repository.Repository;
using CompanyEmployees.service.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CompanyEmployees.Controllers
{
    [Route("api/TestingInfo")]
    [ApiController]
    public class TestingInfoController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ITestingInfoRepository _testingInfoRepository;


        public TestingInfoController(IMapper mapper, ITestingInfoRepository testingInfoRepository)
        {
            _mapper = mapper;
            _testingInfoRepository = testingInfoRepository;
        }

        [HttpPost("Create")]
        //[Authorize(Roles = "Administrator")]

        public async Task<IActionResult> CreateTestingInfo([FromBody] CreateTestingInfo RequestBody)
        {
            var medicine = _testingInfoRepository.FindByCondition(x => x.Name == RequestBody.Name).FirstOrDefault();
            if (medicine is not null)
            {
                return Ok(CommonRespone.CommonResponseFalse<string>("Medicine has already exist"));
            }
            var medEntity = _mapper.Map<TestingInfoEntity>(RequestBody);
            var id = await _testingInfoRepository.CreateAsync(medEntity);
            return Ok(CommonRespone.CommonResponse(EnumRespone.Success, id));

        }

        [HttpGet("Get/{Id}")]
        //[Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetTestInfo(Guid Id)
        {
            var medicine = await _testingInfoRepository.GetByIdAsync(Id);
            if (medicine is null)
            {
                return Ok(CommonRespone.CommonResponseFalse<string>("Medicine has not already exist"));
            }
            var medicineDTO = _mapper.Map<CreateTestingInfo>(medicine);

            return Ok(CommonRespone.CommonResponse(EnumRespone.Success, medicineDTO));
        }

        [HttpPost("GetList")]
        public async Task<IActionResult> GetList([FromBody] getListTestingInfo requestBody)
        {
            //var total = await _testingInfoRepository.FindAll(true).CountAsync();
            var medQuery = _testingInfoRepository.FindAll(true);
            if (requestBody.searchKey is not null)
            {
                medQuery = medQuery.Where(x => x.Name.Contains(requestBody.searchKey));
            }
            if (requestBody.isExaminationService is not null)
            {
                medQuery = medQuery.Where(x => x.isExaminationService == requestBody.isExaminationService);
            }
            if(requestBody.DepartmentId is not null)
            {
                medQuery = medQuery.Where(x => x.DepartmentId == requestBody.DepartmentId);
            }
            var total = await medQuery.CountAsync();
            medQuery  = FunctionCommon.OrderbyCommon(medQuery, requestBody);
            var meds = await medQuery.Include(x => x.Department)
                .Skip(requestBody.PageSize * (requestBody.PageNumber - 1))
                .Take(requestBody.PageSize)
                .Select(x => new TestingInfoGetListDTO()
                {
                    Id= x.Id,
                    Name = x.Name,
                    Description= x.Description,
                    isExaminationService = x.isExaminationService,
                    DepartmentId = x.DepartmentId,
                    DepartmentName = x.Department.Name,
                    Price = x.Price,
                    HealthInsurancePayments = (int)x.HealthInsurancePayments
                })
                .ToListAsync();

            var res = new ResponeGetList<TestingInfoGetListDTO>()
            {
                Values = meds,
                Total = total
            };
            return Ok(CommonRespone.CommonResponse(EnumRespone.Success, res));

        }

        [HttpPost("Update")]
        //[Authorize(Roles = "Administrator")]

        public async Task<IActionResult> Update([FromBody] TestingInfoDTO RequestBody)
        {
            var testingInfoEntity = await _testingInfoRepository.GetByIdAsync(RequestBody.Id);
            if (testingInfoEntity is null)
            {
                return Ok(CommonRespone.CommonResponseFalse<string>("Medicine have already exist"));
            }
            var medEntity = _mapper.Map<TestingInfoEntity>(RequestBody);
            FunctionCommon.CopyNonNullProperties(medEntity, testingInfoEntity);
            //medEntity.Id = medicine.Id;
            await _testingInfoRepository.UpdateAsync(testingInfoEntity);
            return Ok(CommonRespone.CommonResponse(EnumRespone.Success, testingInfoEntity));
        }

        [HttpDelete("delete/{Id}")]
        //[Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeleteMedicine(Guid Id)
        {
            var medicine = await _testingInfoRepository.GetByIdAsync(Id);
            if (medicine is null)
            {
                return Ok(CommonRespone.CommonResponseFalse<string>("Medicine has not already exist"));
            }
            await _testingInfoRepository.DeleteAsync(medicine);

            return Ok(CommonRespone.CommonResponse(EnumRespone.Success));
        }
    }
}
