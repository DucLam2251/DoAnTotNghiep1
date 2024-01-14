using AutoMapper;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.RequestBody;

namespace CompanyEmployees.service.service.Map
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {

            CreateMap<UserForRegistrationDto, User>()
                .ForMember(u => u.UserName, opt => opt.MapFrom(x => x.Email));

            //CreateMap<UserDetailRequestBody, UserDetailEntity>()
                //.ForMember(u => u.Gender, opt => opt.MapFrom(x => (int)x.Gender));
            //CreateMap<UserDetailEntity, UserDetailDTO>()
            //     .ForMember(u => u.Gender, opt => opt.MapFrom(x => x.Gender ? 1 : 0));

            CreateMap<PatientDetailRequestBody, PatientEntity>();
            CreateMap<PatientEntity, PatientDetailDTO>();
            CreateMap<PatientDetailRequestBody, PatientDetailDTO>();
            CreateMap<PatientDetailRequestBody, PatientEntity>();
            CreateMap<CreateTestingInfo, TestingInfoEntity>();
            CreateMap<TestingInfoDTO, TestingInfoEntity>();
            CreateMap<TestingInfoEntity, CreateTestingInfo>();
            CreateMap<DepartmentDTO, DepartmentEntity>();
            CreateMap<CreateDepartmentRequestBody, DepartmentEntity>();
            CreateMap<DepartmentEntity, DepartmentDTO>();
            CreateMap<User, UserDetailDTO>()
                .ForMember(u => u.DateOfBirth, opt => opt.MapFrom(x => x.DateOfBirth.Value.ToLocalTime()));
            CreateMap<CreateMedicineRequest, MedicineEntity>();

        }
    }
}
