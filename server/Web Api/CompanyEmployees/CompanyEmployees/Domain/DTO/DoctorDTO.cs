using CompanyEmployees.Domain.Enum;

namespace CompanyEmployees.Domain.DTO
{
    public class DoctorDTO
    {
        public Guid UserId { get; set; }
        public Guid Id { get; set; }
        public Guid DepartmentId { get; set; }
        public EnumRank Rank { get; set; }
        public EnumPosition Position { get; set; }
        public string? DepartmentName { get; set; }
    }
}
