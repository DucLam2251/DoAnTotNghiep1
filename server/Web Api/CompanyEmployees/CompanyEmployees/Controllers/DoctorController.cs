using CompanyEmployees.Common.Common.Middleware;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.Enum;
using CompanyEmployees.Domain.RequestBody;
using CompanyEmployees.service.Interface;
using CompanyEmployees.service.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace CompanyEmployees.Controllers
{
    [Route("api/doctorcontroller")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IDoctorService _doctorService;
        public DoctorController(UserManager<User> userManager, IDoctorService doctorService)
        {
            _userManager = userManager;

            _doctorService = doctorService;
        }

        [HttpPost("Create")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> AddDoctor([FromBody] CreateAccountDoctor requestBody)
        {
           
            var res = await _doctorService.CreateAccountDoctor(requestBody);
            return Ok(res);
        }

        [HttpGet("GetDoctorInfo/{Id}")]
        [Authorize(Roles = "Administrator,Doctor,Patient")]
        public async Task<IActionResult> GetDoctorInfo(Guid Id)
        {
            //var Id = HttpContext.GetAccountId(); 
            var res = await _doctorService.GetDoctorInfor(Id);
            return Ok(res);

        }

        [HttpPost("UpdateByAdmin")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> UpdateDoctorByAdmin([FromBody] UpdateDoctorByAdminRequestBody requestBody)
        {
            var res = await _doctorService.UpdateDoctorByAdmin(requestBody);
            return Ok(res);

        }
        [HttpPost("getlist")]
        [Authorize(Roles = "Administrator,Doctor,Patient")]
        public async Task<IActionResult> GetList([FromBody] DoctorInforRequestBody requestBody)
        {
            //var Id = HttpContext.GetAccountId();
            var res = await _doctorService.GetListDoctor(requestBody);
            return Ok(res);

        }
    }
}
