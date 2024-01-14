using AutoMapper;
using CompanyEmployees.Common.Common.Respone;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.RequestBody;
using CompanyEmployees.service.Repository.IRepository;
using CompanyEmployees.service.Repository.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CompanyEmployees.Controllers
{
    [Route("api/TestingInfo")]
    [ApiController]
    public class ChartController : Controller
    {
        private readonly IAppointmentRepository _appointmentRepo;
        private readonly IMapper _mapper;
        private readonly IDepartmentRepository _departmentRepo;
        public ChartController(
            IAppointmentRepository appointmentRepo, 
            IMapper mapper,
            IDepartmentRepository departmentRepository)
        {
            _appointmentRepo = appointmentRepo;
            _mapper = mapper;
            _departmentRepo = departmentRepository;
        }

        [HttpPost("GetNumberOfAppointment")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetNumberOfAppointment([FromBody] GetChartNumberApp requestBody)
        {
            var start = requestBody.Start.Date.AddHours(7).ToUniversalTime();
            var end = requestBody.End.Date.AddHours(7).ToUniversalTime();
            var query1 = await _appointmentRepo.FindAll(true)
                 .Where(x => x.StartDate != null 
                         && x.StartDate >= start 
                         && x.StartDate <= x.EndDate)
                 .ToListAsync();
            TimeZoneInfo localTimeZone = TimeZoneInfo.Local;
            var query = await _appointmentRepo.FindAll(true)
                .Where(x => x.StartDate != null &&
                x.StartDate >= start && x.StartDate <= x.EndDate)
                .GroupBy(x => x.StartDate.Value.Date)
                .Select(x => new chartNumberDTO
                {
                    count = x.Count(),
                    dateTime = x.Key.ToLocalTime(),
                })
                .OrderBy(x => x.dateTime)
                .ToListAsync();
            return Ok(CommonRespone.CommonResponse(EnumRespone.Success, query));
        }

        [HttpPost("GetNumberOfAppointmentOnDepartment")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetNumberOfAppointmentOnDepartment([FromBody] GetNumberOfAppointmentOnDepartmentRequestBody requestBody)
        {
            var start = new DateTime();
            var end = new DateTime();
            var Date = requestBody.Date;
            switch (requestBody.Order)
            {
                case OrderbyTimeEnum.Day:
                    start = Date.DateTime.Date.AddHours(7).ToUniversalTime();
                    end = start.AddDays(1);
                    break;
                case OrderbyTimeEnum.Month:
                    start = (new DateTime(Date.Year, Date.Month, 1)).AddHours(7).ToUniversalTime();
                    end = start.AddMonths(1).AddHours(7).ToUniversalTime();
                    break;
                case OrderbyTimeEnum.Quarter:
                    (start, end) = GetQuarter(Date);
                    break;
                default:
                    start = (new DateTime(Date.Year, 1, 1)).AddHours(7).ToUniversalTime();
                    end = start.AddYears(1).AddHours(7).ToUniversalTime();
                    break;
            }

            var query = await _appointmentRepo.FindAll(true)
                            .Where(x => x.StartDate != null
                                     && x.StartDate >= start
                                     && x.StartDate <= end)
                            .Select(x => new GetNumberOfAppointmentOnDepartment()
                            {
                                name = x.MainTestingInfo.Department.Name,
                            })
                            .GroupBy(x => x.name)
                            .Select(x => new GetNumberOfAppointmentOnDepartment()
                            {
                                name = x.Key,
                                count = x.Count(),
                            })
                            .ToListAsync();
            var des = query;
            //var des = query.GroupBy(x => x.name)
            //    .Select(x => new GetNumberOfAppointmentOnDepartment()
            //    {
            //        name = x.Key,
            //        count = x.Count(),
            //    }).ToList();
            var diction = new Dictionary<string, int>();
            var listDepartment = await _departmentRepo.FindAll(true).Select(x => x.Name).ToListAsync();
            listDepartment.ForEach(x => diction.Add(x, 0));
            foreach(var a in des)
            {
                diction[a.name] = a.count;
            }
            var listNumber = new List<GetNumberOfAppointmentOnDepartment>();
            var total = 0;
            foreach(var a in diction) 
            {
                listNumber.Add(new GetNumberOfAppointmentOnDepartment()
                {
                    name = a.Key,
                    count = a.Value
                });
                total += a.Value;
            }
            var res = new ResponeGetList<GetNumberOfAppointmentOnDepartment>()
            {
                Total = total,
                Values = listNumber
            };
            return Ok(CommonRespone.CommonResponse(EnumRespone.Success, res));
        }

        [HttpPost("ChartPayment")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> ChartPayment([FromBody] GetNumberOfAppointmentOnDepartmentRequestBody requestBody)
        {
            var start = new DateTime();
            var end = new DateTime();
            var Date = requestBody.Date;
            switch (requestBody.Order)
            {
                case OrderbyTimeEnum.Day:
                    start = Date.DateTime.Date.AddHours(7).ToUniversalTime();
                    end = start.AddDays(1).AddHours(-1);
                    break;
                case OrderbyTimeEnum.Month:
                    start = (new DateTime(Date.Year, Date.Month, 1)).AddHours(7).ToUniversalTime();
                    end = start.AddMonths(1).AddDays(-1).AddHours(7).ToUniversalTime();
                    break;
                case OrderbyTimeEnum.Quarter:
                    (start, end) = GetQuarter(Date);
                    break;
                default:
                    start = (new DateTime(Date.Year, 1, 1)).AddHours(7).ToUniversalTime();
                    end = start.AddYears(1).AddDays(-1).AddHours(7).ToUniversalTime();
                    break;
            }

            var query = await _appointmentRepo.FindAll(true)
                            .Where(x => x.StartDate != null
                                     && x.StartDate >= start
                                     && x.StartDate <= end)
                            .Select(x => new GetNumberOfAppointmentOnDepartment()
                            {
                                name = x.MainTestingInfo.Department.Name,
                                count = (int)x.PaymentTotal
                            })
                            .GroupBy(x => x.name)
                            .Select(x => new GetNumberOfAppointmentOnDepartment()
                            {
                                name = x.Key,
                                count = x.Sum(x => x.count)
                            })
                            .ToListAsync();
            var res = query;
            return Ok(CommonRespone.CommonResponse(EnumRespone.Success, res));
        }

        private (DateTime, DateTime) GetQuarter(DateTimeOffset date)
        {
            int quarter = (date.Month - 1) / 3 + 1; 

            DateTime startDate = new DateTime(date.Year, (quarter - 1) * 3 + 1, 1);
            DateTime endDate = startDate.AddMonths(3).AddDays(-1);

            startDate = startDate.AddHours(7).ToUniversalTime();
            endDate = endDate.AddHours(7).ToUniversalTime();

            return (startDate, endDate);
        }
    }
}
