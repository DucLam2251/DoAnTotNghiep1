using Common.Common.ActionResponse;
using CompanyEmployees.Common.Common.Respone;
using CompanyEmployees.service.Interface;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Http;

namespace CompanyEmployees.service.Service
{
    public class FileService : IFileService
    {
        public FileService() { }
        public async Task<ActionResponse<string>> UploadFile(IFormFile file)
        {
            ActionResponse<string> res = new();
            var string1 = "http://localhost:5000/FileStorage/";
            try
            {
                var url = string.Empty;
                var fileName = string.Empty;
                var extendFileName = string.Empty;
                if (file.Length > 0)
                {
                    fileName = Guid.NewGuid().ToString() + "." + file.FileName.Split('.').Last();
                    var filePath = @".\FileStorage";
                    bool exists = Directory.Exists(filePath);
                    if (!exists)
                        Directory.CreateDirectory(filePath);
                    filePath = Path.Combine(@".\FileStorage", fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                }
                fileName = string.Concat(string1, fileName);
                res = CommonRespone.CommonResponse(EnumRespone.Success, fileName);
                return res;
            }
            catch (Exception e)
            {
                res = CommonRespone.CommonResponse(EnumRespone.Exception, string.Empty);
                return res;
            }

        }
    }
}
