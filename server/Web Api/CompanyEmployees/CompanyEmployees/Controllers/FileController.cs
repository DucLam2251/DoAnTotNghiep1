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
    [Route("api/filecontroller")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;
        public FileController(IFileService fileService)
        {
            _fileService = fileService;
        }

        [HttpPost("Upload")]
        //[Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Upload(IFormFile avatar)
        {
            var res = await _fileService.UploadFile(avatar);
            return Ok(res);
        }

        [HttpPost("Remove")]
        //[Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Remove(string filepart)
        {
            //var res = await _fileService.UploadFile(avatar);
            return Ok();
        }
    }
}
