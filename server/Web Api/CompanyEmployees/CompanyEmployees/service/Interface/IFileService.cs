using Common.Common.ActionResponse;

namespace CompanyEmployees.service.Interface
{
    public interface IFileService
    {
        Task<ActionResponse<string>> UploadFile(IFormFile file);
    }
}
