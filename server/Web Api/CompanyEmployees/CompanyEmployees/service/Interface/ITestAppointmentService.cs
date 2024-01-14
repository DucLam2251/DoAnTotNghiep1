using Common.Common.ActionResponse;
using CompanyEmployees.Domain.DTO;
using CompanyEmployees.Domain.Entity;
using CompanyEmployees.Domain.RequestBody;

namespace CompanyEmployees.service.Interface
{
    public interface ITestAppointmentService
    {
        Task<ActionResponse<Guid>> Create(CreateTestAppointmentRequestBody requestBody);
        Task<ActionResponse<TestAppointmentEntity>> Submit(SubmitTestAppointmentRequestBody requestBody, Guid UserId);
        Task<ActionResponse<TestAppointmentDTO>> GetTestAppointment(Guid Id);
        Task<ActionResponse<ResponeGetList<TestAppointmentDTO>>> GetListTestAppointment(GetListTestAppointmentRequestBody requestBody);
        Task<ActionResponse<int>> TestPayment(List<Guid> listTest, bool HealthInsurance);
    }
}