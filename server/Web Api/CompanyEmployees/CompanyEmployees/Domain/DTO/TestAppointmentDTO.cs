using CompanyEmployees.Domain.Enum;

namespace CompanyEmployees.Domain.DTO
{
    public class TestAppointmentDTO
    {
        public Guid Id { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public Guid TestingInfoId { get; set; }
        public TestingInfoDTO? TestingInfo { get; set; }
        public PatientDetailDTO? PatientDetail { get; set; }
        public string? ConcusionFromDoctor { get; set; }
        public AppointmentStatusEnum? Status { get; set; }
        public DateTimeOffset DateCreate { get; set; }
        public int Index { get; set; }
        public Guid? DoctorId { get; set; }
        public DoctordetailDTO? DoctordetailDTO { get; set; }
    }
}
