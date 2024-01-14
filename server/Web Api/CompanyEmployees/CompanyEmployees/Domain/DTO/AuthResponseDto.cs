using CompanyEmployees.Domain.Enum;

namespace CompanyEmployees.Domain.DTO
{
    public class AuthResponseDto
    {
        public bool IsAuthSuccessful { get; set; }
        public string? ErrorMessage { get; set; }
        public string? Token { get; set; }
    }
    public class RoleAndEmailAccountDTO
    {
        public string Email { get; set; }
        public string? Role { get; set; }
    }
}
