using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CompanyEmployees.Domain.Configuration
{
    public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole<Guid>>
    {

        public void Configure(EntityTypeBuilder<IdentityRole<Guid>> builder)
        {
            var role = new RoleId();
            builder.HasData(
                new IdentityRole<Guid>
                {
                    Id = new Guid("955206e8-ef7e-465a-b50e-029cbc6124e8"),
                    Name = "Viewer",
                    NormalizedName = "VIEWER"
                },
                new IdentityRole<Guid>
                {
                    Id = role.RoleIdAdmin,
                    Name = "Administrator",
                    NormalizedName = "ADMINISTRATOR"
                },
                new IdentityRole<Guid>
                {
                    Id = role.RoleIdPatient,
                    Name = "Patient",
                    NormalizedName = "PATIENT"
                },
                new IdentityRole<Guid>
                {
                    Id = role.RoleIdDoctor,
                    Name = "Doctor",
                    NormalizedName = "DOCTOR"
                },
                new IdentityRole<Guid>
                {
                    Id = role.RoleIdNurse,
                    Name = "Nurse",
                    NormalizedName = "NURSE"
                }
            ); ;
        }
    }
    public class RoleId
    {
        public Guid RoleIdAdmin { get; set; }
        public Guid RoleIdPatient { get; set; }
        public Guid RoleIdDoctor { get; set; }
        public Guid RoleIdNurse { get; set; }
        public RoleId()
        {
            RoleIdAdmin = new Guid("111c6fae-2658-4450-84bd-38f836665e63");
            RoleIdPatient = new Guid("35e19e6e-365a-497c-8a96-b3cde272b646");
            RoleIdDoctor = new Guid("7367b476-663d-43e8-99b4-6cb2af2b3636");
            RoleIdNurse = new Guid("f47d1654-3efb-4a8e-bc4a-7f1f65f87a5d");
        }
    }
}
