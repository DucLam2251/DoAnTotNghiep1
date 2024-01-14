using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.Enum;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;

namespace CompanyEmployees.Domain.DTO
{
    public class AppointmentDTO
    {
        public Guid Id { get; set; }
        public Guid? DoctorId { get; set; }
        public DoctordetailDTO? Doctor { get; set; }
        public Guid PatientId { get; set; }
        public PatientDetailDTO? Patient { get; set; }
        //public Guid? DepartmentId { get; set; }
        //public virtual DepartmentEntity Department { get; set; }
        public DateTimeOffset ApointmentDate { get; set; }
        public AppointmentStatusEnum? Status { get; set; }
        public float? HeartRate { get; set; }
        public float? Glucozo { get; set; }
        public float? BloodPressureDiatolic { get; set; }
        public float? BloodPressureSystolic { get; set; }
        public float? Temperature { get; set; }
        public List<Medicine>? Medicines { get; set; }
        public List<MedicineInAppointmentDTO>? MedicineDTO { get; set; }
        public DateTimeOffset? StartDate { get; set; }
        public DateTimeOffset? EndDate { get; set; }
        public Guid MainTestingInfoId { get; set; }
        public TestingInfoDTO MainTestingInfo { get; set; }
        public List<Guid>? TestAppointmentIds { get; set; }
        public List<TestAppointmentDTO>? TestingAppointmens { get; set; }
        public int Index { get; set; }
        public string? Description { get; set; }
        public string? ConcusionFromDoctor { get; set; }
        public float PaymentTotal { get; set; }
    }
    public class AppointmentListDTO : AppointmentDTO
    {
        public string LastName { get; set; }
        public int YearOfBirth { get; set; }
        public string NameOfMainTestingInfo { get; set; }
        public GenderEnum Gender { get; set; }
        public string? NameDepartment { get; set; }
    }
    public class MedicineInAppointmentDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        //public float Price { get; set; }
        public string? Description { get; set; }
        public int NumberOfMedicine { get; set; }
        public float Price { get; set; }
        public int HealthInsurancePayments { get; set; }
    }
}
