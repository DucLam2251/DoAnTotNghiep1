using AutoMapper;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.RequestBody;

namespace CompanyEmployees.service.Map
{
    public class DoctorMapper : Profile
    {
        public DoctorMapper()
        {
            CreateMap<CreateDotorRequestBody, DoctorEntity>();
            CreateMap<CreateDotorRequestBody, User>();
            CreateMap<UpdateDoctorByAdminRequestBody, User>();

            CreateMap<CreateAccountDoctor, User>()
                .ForMember(u => u.UserName, opt => opt.MapFrom(x => x.Email));
            //CreateMap<CreateDotorRequestBody, UserDetailEntity>()
            //     .ForMember(u => u.Gender, opt => opt.MapFrom(x => (int)x.Gender == 0 ? false : true));
            //CreateMap<UserDetailEntity, DoctordetailDTO>()
            //     .ForMember(u => u.Gender, opt => opt.MapFrom(x => x.Gender ? 1 : 0));
            //DoctorEntity->DoctorDTO
            CreateMap<DoctorEntity, DoctorDTO>();
            CreateMap<DoctorEntity, DoctordetailDTO>();
            CreateMap<User, DoctordetailDTO>();
            CreateMap<DoctorDTO, DoctorEntity>();
            CreateMap<UpdateDoctorByAdminRequestBody, DoctorEntity>();
            CreateMap<UserDetailRequestBody, User>()
                .ForMember(u => u.DateOfBirth, opt => opt.MapFrom(x => x.DateOfBirth.Value.ToUniversalTime()));

            //CreateMap<DoctordetailDTO, UserDetailEntity>();


        }
    }
}
