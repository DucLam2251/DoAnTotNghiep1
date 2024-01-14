using CompanyEmployees.Domain.Enum;

namespace CompanyEmployees.Domain.RequestBody
{
    public class PatientDetailRequestBody
    {
        public Guid? Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Allergies { get; set; }

        public string? Medicalhistory { get; set; }

        public string? Healthinsurance { get; set; }
        public GenderEnum? Gender { get; set; }

        public float Height { get; set; }

        public float Weight { get; set; }
        public int YearOfBirth { get; set; }


    }
}
