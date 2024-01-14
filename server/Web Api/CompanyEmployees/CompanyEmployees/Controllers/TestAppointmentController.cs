using AutoMapper;
using CompanyEmployees.Common.Common.Respone;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.RequestBody;
using CompanyEmployees.service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata;
using static System.Net.Mime.MediaTypeNames;
using System.Xml.Linq;
using PdfSharp.Drawing;
using PdfSharp.Pdf;
using PdfSharp.Fonts;
using CompanyEmployees.Common.Common.Middleware;

namespace CompanyEmployees.Controllers
{
    [Route("api/TestApointment")]
    [ApiController]
    public class TestAppointmentController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ITestAppointmentService _testApointmentService;


        public TestAppointmentController(IMapper mapper, ITestAppointmentService testApointmentService)
        {
            _mapper = mapper;
            _testApointmentService = testApointmentService;
        }

        [HttpPost("Create")]
        [Authorize(Roles = "Administrator,Doctor,Patient")]
        public async Task<IActionResult> Create([FromBody] CreateTestAppointmentRequestBody RequestBody)
        {
            var res = await _testApointmentService.Create(RequestBody);
            return Ok(res);

        }

        [HttpPost("Submit")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> Submit([FromBody] SubmitTestAppointmentRequestBody RequestBody)
        {
            var userId = HttpContext.GetAccountId();
            var res = await _testApointmentService.Submit(RequestBody, userId);
            return Ok(res);
        }


        [HttpGet("Get/{Id}")]
        //[Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Get(Guid Id)
        {
            var res = await _testApointmentService.GetTestAppointment(Id);
            return Ok(res);
        }

        [HttpPost("GetList")]
        //[Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetList([FromBody] GetListTestAppointmentRequestBody requestBody)
        {
            var res = await _testApointmentService.GetListTestAppointment(requestBody);
            return Ok(res);
        }

        [HttpPost("TestPayment")]
        //[Authorize(Roles = "Administrator")]
        public async Task<IActionResult> TestPayment([FromBody] List<Guid> guids, bool HealthInsurance)
        {
            var res = await _testApointmentService.TestPayment(guids, HealthInsurance);
            return Ok(res);
        }

   
    }
    
}
