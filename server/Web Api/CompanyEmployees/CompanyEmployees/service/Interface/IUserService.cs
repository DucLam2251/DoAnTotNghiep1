using Common.Common.ActionResponse;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.RequestBody;

namespace CompanyEmployees.service.Interface
{
    public interface IUserService
    {
        Task<ActionResponse> UpdateUserDetail(UserDetailRequestBody request, Guid IdAccount);
        Task<ActionResponse<UserDetailDTO>> GetUserDetail(Guid Id);
        Task<ActionResponse<ResponeGetList<UserDetailDTO>>> GetList (GetListRequestBody requestBody);
    }
}
