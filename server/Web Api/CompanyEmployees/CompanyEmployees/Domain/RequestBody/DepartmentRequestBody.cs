using CompanyEmployees.Domain.Enum;

namespace CompanyEmployees.Domain.RequestBody
{
    public class CreateDepartmentRequestBody
    {
        public bool IsActive { get; set; }
        public string Name { get; set; }
        public EnumDepartment Code { get; set; }
    }
    public class UpdateDepartmentRequestBody : CreateDepartmentRequestBody
    {
        public Guid id { get; set; }
    }
}
