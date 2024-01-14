using AutoMapper;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.RequestBody;

namespace CompanyEmployees.service.Map
{
    public class TestMapper : Profile
    {
        public TestMapper() 
        {
            CreateMap<TestAppointmentEntity, TestAppointmentDTO>();
            //.ForMember(u => u.TestingInfo, opt => opt.MapFrom(x => new TestingInfoDTO() { Id = x.TestingInfo})) ;

            CreateMap<TestAppointmentDTO, TestAppointmentEntity>();
            CreateMap<TestingInfoEntity, TestingInfoDTO>();
            CreateMap<CreateTestAppointmentRequestBody, TestAppointmentEntity>();
            //.ForMember(u => u.Gender, opt => opt.MapFrom(x => (int)x.Gender == 0 ? false : true));
        }
    }
}
