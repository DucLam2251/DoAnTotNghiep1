using AutoMapper;
using CompanyEmployees.Common.Common.Respone;
using CompanyEmployees.Domain.Configuration.DTO;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.RequestBody;
using CompanyEmployees.service.Context;
using CompanyEmployees.service.Interface;
using CompanyEmployees.service.JwtFeatures;
using CompanyEmployees.service.Repository.IRepository;
using CompanyEmployees.service.Repository.Repository;
using CompanyEmployees.service.Service;
using iText.StyledXmlParser.Css.Media;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace CompanyEmployees.Controllers
{
    [Route("api/Department")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
     
        private readonly RepositoryContext _dbcontext;
        private readonly IDepartmentRepository _DepartmentRepository;
        private readonly IMapper _mapper;

        public DepartmentController(RepositoryContext repositoryContext, IDepartmentRepository departmentRepository, IMapper mapper)
        {
            _dbcontext = repositoryContext;
            _DepartmentRepository = departmentRepository;
            _mapper = mapper;
        }

        [HttpPost("Create")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> CreateDepartment([FromBody] CreateDepartmentRequestBody RequestBody)
        {
            var medicine = await _DepartmentRepository.FindByCondition(x => x.Name == RequestBody.Name).FirstOrDefaultAsync();
            if (medicine is not null)
            {
                return Ok(CommonRespone.CommonResponseFalse<string>("Medicine has already exist"));
            }
            var medEntity = _mapper.Map<DepartmentEntity>(RequestBody);
            await _DepartmentRepository.CreateAsync(medEntity);
            return Ok(CommonRespone.CommonResponse(EnumRespone.Success));

        }

        [HttpPost("Update")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> CreateDepartment([FromBody] UpdateDepartmentRequestBody requestBody)
        {
            var medicine = await _DepartmentRepository.GetByIdAsync(requestBody.id);
            if (medicine is null)
            {
                return Ok(CommonRespone.CommonResponseFalse<string>("Department is null"));
            }
            var medEntity = _mapper.Map<DepartmentEntity>(requestBody);
            medEntity.Id = requestBody.id;
            await _DepartmentRepository.UpdateAsync(medEntity);
            return Ok(CommonRespone.CommonResponse(EnumRespone.Success));

        }

        [HttpGet("Get/{Id}")]
        [Authorize(Roles = "Administrator,Doctor,Patient")]
        public async Task<IActionResult> GetDepartment(Guid Id)
        {
            var department = await _DepartmentRepository.GetByIdAsync(Id);
            if (department is null)
            {
                return Ok(CommonRespone.CommonResponseFalse<string>("Department has not already exist"));
            }
            var departmentDTO = _mapper.Map<DepartmentEntity>(department);

            return Ok(CommonRespone.CommonResponse(EnumRespone.Success, departmentDTO));

        }

        [HttpPost("GetList")]
        [Authorize(Roles = "Administrator,Doctor,Patient")]
        public async Task<IActionResult> GetList([FromBody] GetListRequestBody requestBody)
        {
            var total = await _DepartmentRepository.FindAll(true).CountAsync();
            var departmentQuery = _DepartmentRepository.FindAll(true);
            if (!requestBody.searchKey.IsNullOrEmpty())
            {
                departmentQuery = departmentQuery.Where(x => x.Name.ToLower().Contains(requestBody.searchKey.ToLower()));
            }
            departmentQuery = FunctionCommon.OrderbyCommon(departmentQuery, requestBody);

            departmentQuery = departmentQuery.Skip(requestBody.PageSize * (requestBody.PageNumber - 1)).
                Take(requestBody.PageSize);


            var deps = await departmentQuery.ToListAsync();

            var departmentDTO = _mapper.Map<List<DepartmentDTO>>(deps);
            var res = new ResponeGetList<DepartmentDTO>()
            {
                Values = departmentDTO,
                Total = total
            };
            return Ok(CommonRespone.CommonResponse(EnumRespone.Success, res));

        }

        [HttpDelete("delete/{Id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Delete(Guid Id)
        {
            var department = await _DepartmentRepository.GetByIdAsync(Id);
            if (department is null)
            {
                return Ok(CommonRespone.CommonResponseFalse<string>("Medicine has not already exist"));
            }
            await _DepartmentRepository.DeleteAsync(department);

            return Ok(CommonRespone.CommonResponse(EnumRespone.Success));
        }
    }
}
