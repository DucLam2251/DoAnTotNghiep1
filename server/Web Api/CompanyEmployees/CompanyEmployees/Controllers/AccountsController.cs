using AutoMapper;
using Common.Common.ActionResponse;
using CompanyEmployees.Common.Common.Middleware;
using CompanyEmployees.Common.Common.Respone;
using CompanyEmployees.Domain.Configuration.DTO;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.Enum;
using CompanyEmployees.Domain.RequestBody;
using CompanyEmployees.service.Context;
using CompanyEmployees.service.Interface;
using CompanyEmployees.service.JwtFeatures;
using CompanyEmployees.service.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace CompanyEmployees.Controllers
{
    [Route("api/accounts")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly JwtHandler _jwtHandler;
        private readonly IServiceProvider _serviceProvider;
        private readonly IUserService _userService;
        private readonly RepositoryContext _dbcontext;
        public AccountsController(UserManager<User> userManager, IMapper mapper, JwtHandler jwtHandler, IServiceProvider serviceProvider, IUserService userService, RepositoryContext repositoryContext)
        {
            _userManager = userManager;
            _mapper = mapper;
            _jwtHandler = jwtHandler;
            _serviceProvider = serviceProvider;
            _userService = userService;
            _dbcontext = repositoryContext;
        }

        [HttpPost("creataccountpatient")]
        public async Task<IActionResult> CreateAccountPatient([FromBody] UserForRegistrationDto userForRegistration)
        {
            if (userForRegistration == null || !ModelState.IsValid)
                return BadRequest();
            var user = _mapper.Map<User>(userForRegistration);
            //user.UserId = Guid.NewGuid();
            var result = await _userManager.CreateAsync(user, userForRegistration.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);

                return BadRequest(new RegistrationResponseDto { Errors = errors });
            }


            await _userManager.AddToRoleAsync(user, RoleEnum.Administrator.ToString());
            var userLogin = await _userManager.FindByNameAsync(user.Email);
            var signingCredentials = _jwtHandler.GetSigningCredentials();
            var claims = await _jwtHandler.GetClaims(userLogin);
            claims.Add(new Claim("id", userLogin.Id.ToString()));
            var tokenOptions = _jwtHandler.GenerateTokenOptions(signingCredentials, claims);
            var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return Ok(CommonRespone.CommonResponse(EnumRespone.Success, token));
        }

        [HttpGet("getclaims")]
        public async Task<IActionResult> GetClaims()
        {
            var claim = User.Claims;
            var userId = HttpContext.GetAccountId();
            string email = claim.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;


            var userIdClaim = claim.FirstOrDefault(c => c.Type == "id");
            //var entity = (from detail in _dbcontext.UserDetailEntity
            //              join patient in _dbcontext.PatienEntity on detail.Id equals patient.Usermanager
            //              select new
            //              {
            //                  Id = patient.Id,
            //                  FirstName = patient.FirstName, 
            //                  LastName = patient.LastName,
            //              }).Take(10).ToListAsync();
            return StatusCode(201);
        }
        [HttpGet("getAu")]
        //[Authorize(Roles = "Administrator,Doctor,Patient")]
        [Authorize(Roles = "Administrator,Doctor,Patient,Nurse")]
        //[Authorize(Roles = "Doctor")]
        //[Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetInfo()
        {
            var claim = User.Claims;

            string role = claim.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            string email = claim.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            
            var res = new RoleAndEmailAccountDTO()
            {
                Email = email,
                Role = role
            };
            return Ok(CommonRespone.CommonResponse(EnumRespone.Success, res));

        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] UserForAuthenticationDto userForAuthentication)
        {
            var user = await _userManager.FindByNameAsync(userForAuthentication.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, userForAuthentication.Password))
                return Unauthorized(new AuthResponseDto { ErrorMessage = "Invalid Authentication" });
            
            var signingCredentials = _jwtHandler.GetSigningCredentials();
            var claims = await _jwtHandler.GetClaims(user);
            claims.Add(new Claim("id", user.Id.ToString()));
            var tokenOptions = _jwtHandler.GenerateTokenOptions(signingCredentials, claims);
            var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return Ok(new AuthResponseDto { IsAuthSuccessful = true, Token = token });
        }

        [HttpGet("getuserdetail")]
        public async Task<IActionResult> GetDetail()
        {

            var claims = User.Claims;
            var userId = claims.FirstOrDefault(c => c.Type == "id");
            var res = new ActionResponse<UserDetailDTO>();
            if (userId != null && Guid.TryParse(userId.Value, out Guid id))
            {
                res = await _userService.GetUserDetail(id);
                return Ok(res);
            }
            return BadRequest();
        }
        [HttpPost("updateuserdetail")]
        public async Task<IActionResult> UpdateDetail([FromBody] UserDetailRequestBody requestBody)
        {

            var userId = HttpContext.GetAccountId();
            var res = new ActionResponse();

            res = await _userService.UpdateUserDetail(requestBody, userId);
            return Ok(res);
        }

        [HttpPost("getListAccount")]
        public async Task<IActionResult> GetListAccount([FromBody] GetListRequestBody requestBody)
        {

            var res = await _userService.GetList(requestBody);
            return Ok(res);
        }
        [HttpDelete("DeleteAccount/{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeleteAccount (Guid id)
        {
            var userToDelete = await _userManager.FindByIdAsync(id.ToString());
            if(userToDelete is not null)
            {
                try
                {
                    var result = await _userManager.DeleteAsync(userToDelete);

                }
                catch
                {
                    return Ok(CommonRespone.CommonResponse(EnumRespone.Exception));
                }
            }
            return Ok(CommonRespone.CommonResponse(EnumRespone.Success));
        }
        [HttpPost("changepassword")]
        public async Task<IActionResult> changepassword([FromBody] UserChangePassWordDto requestBody)
        {
            var user = await _userManager.FindByNameAsync(requestBody.Email);

            var res = await _userManager.ChangePasswordAsync(user, requestBody.CurrentPass, requestBody.Password);
            return Ok(res);
        }
    }
}
