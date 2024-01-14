using CompanyEmployees.Domain.Enum;

namespace CompanyEmployees.Domain.DTO
{
    public class CreateTestingInfo
    {
        public string? Name { get; set; }
        public Guid? DepartmentId { get; set; }
        public float? Price { get; set; }
        public int? HealthInsurancePayments { get; set; }
        public string? Description { get; set; }
        public bool isExaminationService { get; set; }

    }
    public class TestingInfoDTO : CreateTestingInfo
    {
        public Guid Id { get; set; }
        public DepartmentDTO? Department { get; set; }
    }
    public class TestingInfoGetListDTO : CreateTestingInfo
    {
        public Guid Id { get; set; }
        public Guid DepartmentId { get; set; }
        public string DepartmentName { get; set; }
    }
}
