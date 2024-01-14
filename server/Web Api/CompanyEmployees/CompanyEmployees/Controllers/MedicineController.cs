using AutoMapper;
using CompanyEmployees.Common.Common.Respone;
using CompanyEmployees.Domain.Configuration.DTO;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.Enum;
using CompanyEmployees.Domain.RequestBody;
using CompanyEmployees.service.Repository.IRepository;
using CompanyEmployees.service.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace CompanyEmployees.Controllers
{
    [Route("api/medicine")]
    [ApiController]
    public class MedicineController : ControllerBase
    {

        private readonly IMapper _mapper;
        private readonly IMedicineRepositoty _medicineRepositoty;


        public MedicineController(IMapper mapper, IMedicineRepositoty medicineRepositoty)
        {
            _mapper = mapper;
            _medicineRepositoty = medicineRepositoty;
        }

        [HttpPost("Create")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> CreateMedicine([FromBody] CreateMedicineRequest RequestBody)
        {
            var medicine = _medicineRepositoty.FindByCondition(x => x.Title == RequestBody.Title).FirstOrDefault();
            if (medicine is not null)
            {
                return Ok(CommonRespone.CommonResponseFalse<string>("Medicine has already exist"));
            }
            var medEntity = _mapper.Map<MedicineEntity>(RequestBody);
            var id = await _medicineRepositoty.CreateAsync(medEntity);
            medEntity.Id = id;
            return Ok(CommonRespone.CommonResponse(EnumRespone.Success, medEntity));

        }

        [HttpGet("Get/{Id}")]
        //[Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetMedicine(Guid Id)
        {
            var medicine = await _medicineRepositoty.GetByIdAsync(Id);
            if (medicine is null)
            {
                return Ok(CommonRespone.CommonResponseFalse<string>("Medicine has not already exist"));
            }
            var medicineDTO = _mapper.Map<MedicineDTO>(medicine);

            return Ok(CommonRespone.CommonResponse(EnumRespone.Success, medicineDTO));

        }

        [HttpPost("GetList")]
        public async Task<IActionResult> GetList([FromBody] GetListRequestBody requestBody)
        {
            //var total = await _medicineRepositoty.FindAll(true).CountAsync();
            var medQuery = _medicineRepositoty.FindAll(true);
            if (requestBody.searchKey is not null)
            {
                medQuery = medQuery.Where(x => x.Title.ToLower().Contains(requestBody.searchKey.ToLower()));
            }
            var total = await medQuery.CountAsync();
            medQuery = FunctionCommon.OrderbyCommon(medQuery, requestBody);
            medQuery = medQuery.Skip(requestBody.PageSize * (requestBody.PageNumber - 1)).
                Take(requestBody.PageSize);


            var meds = await medQuery.ToListAsync();

            var medicineDTO = _mapper.Map<List<MedicineDTO>>(meds);
            var res = new ResponeGetList<MedicineDTO>()
            {
                Values = medicineDTO,
                Total = total
            };
            return Ok(CommonRespone.CommonResponse(EnumRespone.Success, res));

        }

        [HttpPost("Update")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> UpdateMedicine([FromBody] MedicineDTO RequestBody)
        {
            var medicine = await _medicineRepositoty.FindByCondition(x => x.Id == RequestBody.Id).FirstOrDefaultAsync();
            if (medicine is null)
            {
                return Ok(CommonRespone.CommonResponseFalse<string>("Medicines have already exist"));
            }
            var medEntity = _mapper.Map<MedicineEntity>(RequestBody);
            FunctionCommon.CopyNonNullProperties(medEntity, medicine);
            await _medicineRepositoty.UpdateAsync(medEntity);
            return Ok(CommonRespone.CommonResponse(EnumRespone.Success));
        }

        [HttpDelete("delete/{Id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeleteMedicine(Guid Id)
        {
            var medicine = await _medicineRepositoty.GetByIdAsync(Id);
            if (medicine is null)
            {
                return Ok(CommonRespone.CommonResponseFalse<string>("Medicine has not already exist"));
            }
            await _medicineRepositoty.DeleteAsync(medicine);

            return Ok(CommonRespone.CommonResponse(EnumRespone.Success));
        }

        [HttpPost("deletelist")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeleteMedicine(List<Guid> ListId)
        {
            var listMed = _medicineRepositoty.FindByCondition(x => ListId.Contains(x.Id));
            if (listMed is null)
            {
                return Ok(CommonRespone.CommonResponseFalse<string>("Medicine has not already exist"));
            }
            await _medicineRepositoty.DeleteListAsync(listMed);

            return Ok(CommonRespone.CommonResponse(EnumRespone.Success));
        }
    }
}
