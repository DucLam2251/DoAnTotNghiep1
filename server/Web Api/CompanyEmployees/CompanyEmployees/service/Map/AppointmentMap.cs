using AutoMapper;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.RequestBody;
using Microsoft.AspNetCore.Mvc;

namespace CompanyEmployees.service.Map
{
    public class AppointmentMap : Profile
    {
        public AppointmentMap() 
        {
            CreateMap<CreateAppointmentRequestBody, AppointmentEntity>();
            CreateMap<UpdateHealthAppointmentRequestBody, AppointmentEntity>();
            CreateMap<CreateTestAppointmentRequestBody, TestAppointmentDTO>();
            CreateMap<MedicineInAppointmentDTO, Medicine>();
            CreateMap<Medicine, MedicineInAppointmentDTO>();


        }
    }
}
