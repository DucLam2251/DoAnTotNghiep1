using CompanyEmployees.Domain.Enum;

namespace CompanyEmployees.Domain.DTO
{
    public class UserDetailDTO
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public string? Avatar { get; set; }
        public GenderEnum? Gender { get; set; }

        public string? Address { get; set; }
        public string? Email { get; set; }
        public DoctorDTO? DoctorDTO { get; set; }
    }
}
