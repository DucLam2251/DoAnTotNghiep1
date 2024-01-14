using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.Enum;

namespace CompanyEmployees.Domain.RequestBody
{
    public class AppointmentRequestbody
    {
    }
    public class CreateAppointmentRequestBody
    {
        public DateTimeOffset ApointmentDate { get; set; }
        public Guid PatientId { get; set; }
        public Guid MainTestingInfoId { get; set; }
        public string? Description { get; set; }
    }
    public class UpdateHealthAppointmentRequestBody
    {
        public Guid Id { get; set; }
        //public Guid? DoctorId { get; set; }
        public float? HeartRate { get; set; }
        public float? Glucozo { get; set; }
        public float? BloodPressureDiatolic { get; set; }
        public float? BloodPressureSystolic { get; set; }
        public float? Temperature { get; set; }
        public string? ConcusionFromDoctor { get; set; }
        public List<Medicine>? Medicines { get; set; }
    }
    public class AddTestAppointmentRequestBody
    {
        public Guid Id { get; set; }
        public CreateTestAppointmentRequestBody testAppointmentCreate { get; set; }
    }
    public class UpdateAppointmentStatusRequestBody
    {
        public Guid appointmentID { get; set; }
        public AppointmentStatusEnum newStatus { get; set; }
        public bool HealthInsurance { get; set; }
    }
}
