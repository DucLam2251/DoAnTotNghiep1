using AutoMapper;
using Common.Common.ActionResponse;
using CompanyEmployees.Common.Common.Middleware;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.RequestBody;
using CompanyEmployees.service.Interface;
using CompanyEmployees.service.JwtFeatures;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
namespace CompanyEmployees.Controllers
{
    [Route("api/patientcontroller")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly JwtHandler _jwtHandler;
        private readonly IPatientService _patientService;
        private readonly IUserService _userService;

        public PatientController(UserManager<User> userManager, IMapper mapper, JwtHandler jwtHandler, IPatientService patientService, IUserService userService)
        {
            _userManager = userManager;
            _mapper = mapper;
            _jwtHandler = jwtHandler;
            _patientService = patientService;
            _userService = userService;
        }

        [HttpPost("AddPatientDetail")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> AddPatientDetail([FromBody] PatientDetailRequestBody requestBody)
        {

            if (requestBody.Id is not null) return BadRequest("Id in requestBody is null");
            var userId = HttpContext.GetAccountId();

            var res = await _patientService.AddPatientDetail(requestBody, userId);
            return Ok(res);

        }

        [HttpGet("GetPatientDetail/{PatientId}")]
        [Authorize(Roles = "Patient,Administrator,Doctor")]
        public async Task<IActionResult> GetPatientDetail(Guid PatientId)
        {
            var claim = User.Claims;
            var a = claim.FirstOrDefault(x => x.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role");
            var isPatient = a.Value.Contains("Patient");
            var userId = HttpContext.GetAccountId();
            var res = await _patientService.GetPatientDetail(PatientId, userId, isPatient);
            return Ok(res);
        }

        [HttpPost("Update")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> Update([FromBody] PatientDetailRequestBody requestBody)
        {
            var userId = HttpContext.GetAccountId();
            var res = await _patientService.Update(requestBody, userId);
                return Ok(res);
        }

        [HttpPost("GetListPatient")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetListPatient([FromBody] GetListRequestBody requestBody)
        {
            var userId = HttpContext.GetAccountId();

            var res = await _patientService.GetListPatients(userId);
                return Ok(res);

        }

        [HttpPost("GetListPatientByAdmin")]
        //[Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetListPatientByAdmin([FromBody] GetListRequestBody requestBody)
        {

            var res = await _patientService.GetListPatientsByAdmin(requestBody);
            return Ok(res);

        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Patient,Administrator")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = HttpContext.GetAccountId();

            var res = await _patientService.Delete(id, userId);
            return Ok(res);

        }
    } 
}
