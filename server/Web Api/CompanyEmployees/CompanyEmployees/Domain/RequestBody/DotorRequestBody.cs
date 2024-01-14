using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Enum;
using System.ComponentModel.DataAnnotations;

namespace CompanyEmployees.Domain.RequestBody
{
    public class CreateDotorRequestBody
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public string? Avatar { get; set; }
        public GenderEnum Gender { get; set; }
        public string Address { get; set; }
        //public EnumDepartment DepartmentCode { get; set; }
        public EnumRank Rank { get; set; }
        public EnumPosition Position { get; set; }
        public Guid DepartmentId { get; set; }
    }

    public class CreateAccountDoctor : CreateDotorRequestBody
    {
        public string Email { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }

        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string? ConfirmPassword { get; set; }
    }
    public class UpdateDoctorByAdminRequestBody
    {
        public Guid Id { get; set; }
        public EnumRank Rank { get; set; }
        public EnumPosition Position { get; set; }
        public Guid DepartmentId { get; set; }
    }
}
