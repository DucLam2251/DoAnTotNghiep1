using CompanyEmployees.Domain.Configuration;
using CompanyEmployees.Domain.Entity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CompanyEmployees.service.Context
{
    public class RepositoryContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        public RepositoryContext(DbContextOptions<RepositoryContext> options)
        : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new AppointmentConfiguration());
            modelBuilder.ApplyConfiguration(new DepartmentConfiguration());
            modelBuilder.ApplyConfiguration(new DoctorConfiguration());
            modelBuilder.ApplyConfiguration(new PatientConfiguration());
            modelBuilder.ApplyConfiguration(new RoleConfiguration());
            modelBuilder.ApplyConfiguration(new TestAppointmentConfiguration());
            modelBuilder.ApplyConfiguration(new TestingInfoConfiguration());
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new MedicineConfiguration());
            modelBuilder.ApplyConfiguration(new ChatConfiguration());
        }

        public DbSet<PatientEntity>? PatienEntity { get; set; }
        public DbSet<DoctorEntity>? DoctorEntity { get; set; }
        public DbSet<AppointmentEntity>? AppointmentEntity { get; set; }
        public DbSet<MedicineEntity>? MedicineEntities { get; set; }
        public DbSet<DepartmentEntity>? DepartmentEntities { get; set; }
        public DbSet<TestAppointmentEntity>? TestApointmentEntities { get; set; }
        public DbSet<TestingInfoEntity>? TestingInfoEntities { get; set; }
        public DbSet<ChatEntity>? ChatEntities { get; set; }
        public DbSet<IdentityRole>? roleEntities { get; set; }
    }
}
