using Common.Common.ActionResponse;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Enum;
using CompanyEmployees.Domain.RequestBody;

namespace CompanyEmployees.service.Interface
{
    public interface IPatientService
    {
        Task<ActionResponse<PatientDetailDTO>> AddPatientDetail(PatientDetailRequestBody requestBody, Guid userManagerId);
        Task<ActionResponse<PatientDetailDTO>> GetPatientDetail(Guid PatientId, Guid ManagerId, bool isPatient);
        Task<ActionResponse<PatientDetailDTO>> Update(PatientDetailRequestBody requestBody, Guid userManagerId);
        Task<ActionResponse<PatientDetailDTO>> Delete(Guid Id, Guid managerId);
        Task<ActionResponse<ResponeGetList<PatientDetailDTO>>> GetListPatients(Guid IdManager);
        Task<ActionResponse<ResponeGetList<ViewPatientListDto>>> GetListPatientsByAdmin(GetListRequestBody requestBody);
    }
}