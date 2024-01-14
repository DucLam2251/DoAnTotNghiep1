using CompanyEmployees.Domain.Enum;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CompanyEmployees.Domain.Entity
{
    public class User : IdentityUser<Guid>
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public string? Avatar { get; set; }
        public GenderEnum? Gender { get; set; }
        public string? Address { get; set; }
        [JsonIgnore]
        public virtual DoctorEntity Doctor { get; set; }
        public virtual List<PatientEntity> Patients { get; set; }
        [InverseProperty("Sender")]
        public virtual List<ChatEntity> ChatsSend { get; set; }
        [InverseProperty("Receiver")]
        public virtual List<ChatEntity> ChatsReceived { get; set; }
    }
}
