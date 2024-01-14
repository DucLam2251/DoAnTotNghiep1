namespace CompanyEmployees.Domain.RequestBody
{
    public class CreateTestAppointmentRequestBody
    {
        public string? Description { get; set; }
        public Guid TestingInfoId { get; set; }
        public Guid PatientId { get; set; }

    }
    public class SubmitTestAppointmentRequestBody
    {
        public Guid Id { get; set; }
        public string LinkImage { get; set; }
        public string ConcusionFromDoctor { get; set; }
        //public Guid PatientId { get; set; }
    }
}
