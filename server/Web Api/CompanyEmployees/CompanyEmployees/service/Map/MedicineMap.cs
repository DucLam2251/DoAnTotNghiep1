using AutoMapper;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;

namespace CompanyEmployees.service.Map
{
    public class MedicineMap : Profile
    {
        public MedicineMap() 
        {
            CreateMap<MedicineDTO, MedicineEntity>();

            CreateMap<MedicineEntity, MedicineDTO>();
        }
    }
}
