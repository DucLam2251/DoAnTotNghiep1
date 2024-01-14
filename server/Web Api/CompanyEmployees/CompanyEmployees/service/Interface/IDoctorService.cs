using Common.Common.ActionResponse;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.RequestBody;

namespace CompanyEmployees.service.Interface
{
    public interface IDoctorService
    {
        Task<ActionResponse<Guid>> CreateAccountDoctor(CreateAccountDoctor doctorInfor);
        Task<ActionResponse<DoctordetailDTO>> GetDoctorInfor(Guid id);
        Task<ActionResponse> UpdateDoctorByAdmin(UpdateDoctorByAdminRequestBody requesbody);
        Task<ActionResponse<ResponeGetList<DoctorGetListDTO>>> GetListDoctor(DoctorInforRequestBody requestBody);
    }
}
