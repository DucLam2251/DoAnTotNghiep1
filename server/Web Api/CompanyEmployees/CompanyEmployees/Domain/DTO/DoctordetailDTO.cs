using CompanyEmployees.Domain.Enum;

namespace CompanyEmployees.Domain.DTO
{
    public class DoctordetailDTO
    {
        public Guid Id { get; set; }
        public DoctorDTO DoctorInfor { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public string? Avatar { get; set; }
        public GenderEnum Gender { get; set; }

        public string Address { get; set; }
        public Guid?  UserId { get; set; }
    }
    public class DoctorGetListDTO
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public EnumRank? Rank { get; set; }
        public EnumPosition? Position { get; set; }
        public string LastName { get; set; }
        public string? Avatar { get; set; }
        public GenderEnum? Gender { get; set; }
        public string Email {  get; set; }
    }
}
