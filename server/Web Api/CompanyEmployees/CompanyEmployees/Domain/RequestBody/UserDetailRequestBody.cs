using CompanyEmployees.Domain.Enum;
using System.ComponentModel.DataAnnotations.Schema;

namespace CompanyEmployees.Domain.RequestBody
{
    public class UserDetailRequestBody
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public string? Avatar { get; set; }
        public GenderEnum? Gender { get; set; }
        public string? Address { get; set; }
    }
}
