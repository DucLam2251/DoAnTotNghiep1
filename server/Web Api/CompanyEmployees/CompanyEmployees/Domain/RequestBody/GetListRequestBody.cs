using CompanyEmployees.Domain.Enum;

namespace CompanyEmployees.Domain.RequestBody
{
    public class GetListRequestBody
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string? searchKey { get; set; }
        public string? orderBy { get; set; }
        public bool? isAssending { get; set; }
    }
    public class getListTestingInfo : GetListRequestBody
    {
        public bool? isExaminationService { get; set; }
        public Guid? DepartmentId { get; set; }
    }
    public class GetListTestAppointmentRequestBody : GetListRequestBody
    {
        public Guid? TestInfoId { get; set; }
        public DateTimeOffset DateTime { get; set; }
        public AppointmentStatusEnum? Status { get; set; }
    }
    public class GetListAppointments : GetListRequestBody
    {
        public Guid? mainTestId { get; set; }
        public DateTimeOffset DateTime { get; set; }
        public AppointmentStatusEnum? Status { get; set; }
    }
    public class GetListAppointmentsByPatient : GetListRequestBody
    {
        public Guid? mainTestId { get; set; }
        public AppointmentStatusEnum? Status { get; set; }
        public Guid? PatienId { get; set; }
    }
}
