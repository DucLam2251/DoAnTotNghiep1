using Microsoft.EntityFrameworkCore;
using CompanyEmployees.service.Service;
using CompanyEmployees.service.Repository.IRepository;
using CompanyEmployees.service.Repository.Repository;
using CompanyEmployees.Build.Common.Interfaces;
using CompanyEmployees.Build.Infratructure;
using CompanyEmployees.service.Controllers;
using CompanyEmployees.service.Interface;
using CompanyEmployees.service.Context;
using CompanyEmployees.Service.Interface;

namespace CompanyEmployees.service.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureCors(this IServiceCollection services) =>
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder =>
                    builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            });

        public static void ConfigureIISIntegration(this IServiceCollection services) =>
            services.Configure<IISOptions>(options =>
            {

            });

        public static void ConfigureSqlContext(this IServiceCollection services, IConfiguration configuration) =>
             services.AddDbContext<RepositoryContext>(opts =>
                 //opts.UseSqlServer(configuration.GetConnectionString("sqlConnection"), b => b.MigrationsAssembly("CompanyEmployees")));
                 opts.UseNpgsql(configuration.GetConnectionString("sqlConnection")), ServiceLifetime.Scoped);


        public static void ConfigureRepositoryManager(this IServiceCollection services)
        {
            services
                .AddScoped(typeof(IRepositoryBaseAsync<,,>), typeof(RepositoryBaseAsync<,,>))
                    .AddScoped(typeof(IUnitOfWork<>), typeof(UnitOfWork<>))

                 .AddScoped(typeof(IPatientRepository), typeof(PatientRepository))
                 .AddScoped(typeof(IDoctorRepository), typeof(DoctorRepository))
                 .AddScoped(typeof(IAppointmentRepository), typeof(AppointmentRepository))
                 .AddScoped(typeof(IMedicineRepositoty), typeof(MedicineRepositoty))
                 .AddScoped(typeof(IDepartmentRepository), typeof(DepartmentRepository))
                 .AddScoped(typeof(ITestingInfoRepository), typeof(TestingInfoRepository))
                 .AddScoped(typeof(ITestAppointmentRepository), typeof(TestAppointmentRepository))


                 .AddScoped(typeof(IUserService), typeof(UserService))
                 .AddScoped(typeof(IDoctorService), typeof(DoctorService))
                 .AddScoped(typeof(ITestAppointmentService), typeof(TestAppointmentService))
                 .AddScoped(typeof(IPatientService), typeof(PatientService))
    
                 .AddScoped(typeof(IAppointmentService), typeof(AppointmentService))
                 .AddScoped(typeof(IFileService), typeof(FileService))
                 .AddScoped(typeof(IChatService), typeof(ChatService));
                  

        }

    }
}
