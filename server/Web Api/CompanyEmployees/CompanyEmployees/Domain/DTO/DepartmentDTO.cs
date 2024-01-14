using CompanyEmployees.Domain.Enum;

namespace CompanyEmployees.Domain.DTO
{
    public class DepartmentDTO
    {
        public Guid? Id { get; set; }
        public bool? HasTest { get; set; }
        public string? Name { get; set; }
        public bool? IsActive { get; set; }
    }

}
