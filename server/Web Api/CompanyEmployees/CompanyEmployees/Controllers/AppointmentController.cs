using CompanyEmployees.Common.Common.Middleware;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.Enum;
using CompanyEmployees.Domain.RequestBody;
using CompanyEmployees.service.Interface;
using CompanyEmployees.service.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PdfSharp.Fonts;
using System.Security.Claims;
using System.Xml.Linq;
using PdfSharp.Drawing;
using PdfSharp.Pdf;
using PdfSharp.Fonts;
using Microsoft.AspNetCore.Authorization;
namespace CompanyEmployees.Controllers
{
    [Route("api/appointment")]
    [ApiController]
    public class AppointmentController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly IAppointmentService _appointmentService;
        public AppointmentController(UserManager<User> userManager, IAppointmentService appointmentService)
        {
            _userManager = userManager;

            _appointmentService = appointmentService;
        }

        [HttpPost("Create")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentRequestBody requestBody)
        {
            var claim = User.Claims;
            string role = claim.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            var roleEnum = FunctionCommon.StringToRoleEnum(role);
            var res = await _appointmentService.CreateAppointment(requestBody, roleEnum);
            return Ok(res);
        }

        [HttpGet("Get/{Id}")]
        [Authorize(Roles = "Administrator,Doctor,Patient,Nurse")]
        public async Task<IActionResult> GetAppointment(Guid Id)
        {
            var res = await _appointmentService.GetDetailAppointment(Id);
            return Ok(res);
        }

        [HttpPost("getlist")]
        [Authorize(Roles = "Administrator,Doctor,Patient,Nurse")]
        public async Task<IActionResult> GetListAppointments([FromBody] GetListAppointments requestBody)
        {
            var userId = HttpContext.GetAccountId();
            var claim = User.Claims;
            string role = claim.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            var roleEnum = FunctionCommon.StringToRoleEnum(role);
            var res = await _appointmentService.getList(requestBody, userId, roleEnum == RoleEnum.Patient);
            return Ok(res);
        }

        [HttpPost("getlistByPatient")]
        //[Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetListByPatient([FromBody] GetListAppointmentsByPatient requestBody)
        {
            var id = HttpContext.GetAccountId();
            var res = await _appointmentService.getListByPatient(requestBody, id);
            return Ok(res);
        }

        [HttpPost("update")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> UpdateAppointment(UpdateHealthAppointmentRequestBody requestBody)
        {
            var res = await _appointmentService.UpdateAppointment(requestBody);
            return Ok(res);
        }

        [HttpPost("updateStatus")]
        [Authorize(Roles = "Administrator,Doctor,Patient,Nurse")]
        public async Task<IActionResult> UpdateStatusAppointment([FromBody] UpdateAppointmentStatusRequestBody requestBody)
        {
            var doctorId = HttpContext.GetAccountId();
            var res = await _appointmentService.UpdateStatus(requestBody, doctorId);
            return Ok(res);
        }

        [HttpPost("AddTestAppointment")]
        [Authorize(Roles = "Administrator,Doctor,Patient")]
        public async Task<IActionResult> AddTestAppointment([FromBody] AddTestAppointmentRequestBody requestBody)
        {
            //var doctorId = HttpContext.GetAccountId();
            var res = await _appointmentService.AddTestAppointment(requestBody);
            return Ok(res);
        }

        [HttpPost("AddListTestAppointment")]
        //[Authorize(Roles = "Administrator")]
        public async Task<IActionResult> AddListTestAppointment([FromBody] List<AddTestAppointmentRequestBody> requestBody)
        {
            //var doctorId = HttpContext.GetAccountId();
            var res = await _appointmentService.AddListTestAppointment(requestBody);
            return Ok(res);
        }
        [HttpPost("AppointmentPayment")]
        //[Authorize(Roles = "Administrator")]
        public async Task<IActionResult> AppointmentPayment(Guid id, bool HealthInsurance)
        {
            //var doctorId = HttpContext.GetAccountId();
            var res = await _appointmentService.AppointmentPayment(id, HealthInsurance);
            return Ok(res);
        }

    }

}
