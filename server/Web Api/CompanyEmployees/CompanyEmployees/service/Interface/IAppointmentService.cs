using Common.Common.ActionResponse;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.Enum;
using CompanyEmployees.Domain.RequestBody;

namespace CompanyEmployees.service.Interface
{
    public interface IAppointmentService
    {
        Task<ActionResponse<Guid>> CreateAppointment(CreateAppointmentRequestBody requestBody, RoleEnum RoleAccountCreate);
        Task<ActionResponse<Guid>> UpdateStatus(UpdateAppointmentStatusRequestBody requestBody, Guid doctorId);
        Task<ActionResponse<AppointmentDTO>> GetDetailAppointment(Guid IdAppointment);
        Task<ActionResponse<AppointmentEntity>> UpdateAppointment(UpdateHealthAppointmentRequestBody requestBody);
        Task<ActionResponse<ResponeGetList<AppointmentListDTO>>> getList(GetListAppointments requestBody, Guid UserId, bool isPatient);
        Task<ActionResponse<TestAppointmentDTO>> AddTestAppointment(AddTestAppointmentRequestBody requestBody);
        Task<ResponeGetList<AddTestAppointmentRequestBody>> AddListTestAppointment(List<AddTestAppointmentRequestBody> requestBody);
        Task<ActionResponse<float>> AppointmentPayment(Guid id, bool HealthInsurance);
        Task<ActionResponse<ResponeGetList<AppointmentListDTO>>> getListByPatient(GetListAppointmentsByPatient requestBody, Guid UserId);
    }
}