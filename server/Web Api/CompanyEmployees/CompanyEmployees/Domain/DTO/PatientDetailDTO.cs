using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.Enum;

namespace CompanyEmployees.Domain.DTO
{
    public class PatientDetailDTO
    {
        public Guid Id { get; set; }
        public Guid UsermanagerId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Allergies { get; set; }

        public string Medicalhistory { get; set; }

        public string Healthinsurance { get; set; }

        public float Height { get; set; }

        public float Weight { get; set; }
        public int YearOfBirth { get; set; }
        public GenderEnum Gender { get; set; }
        public UserDetailDTO UserManager { get; set; }
        public List<AppointmentListDTO> appointmentListDTOs { get; set; }
    }
    public class ViewPatientListDto
    {
        public Guid Id { get; set; }
        public string lastName { get; set; }
        public int YearOfBirth { get; set; }
        public GenderEnum Gender { get; set; }
        public string NameManage {  get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
    }

}
