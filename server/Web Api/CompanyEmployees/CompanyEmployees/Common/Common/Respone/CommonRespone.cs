using Common.Common.ActionResponse;
using static CompanyEmployees.Common.Common.Respone.CommonRespone;

namespace CompanyEmployees.Common.Common.Respone
{
    public class CommonRespone
    {
        public static ActionResponse CommonResponse(EnumRespone responseEnum)
        {
            var res = new ActionResponse();
            switch (responseEnum)
            {
                case EnumRespone.Success:
                    {
                        res.Success = true;
                        res.Message = Message.GetMessage(EnumMessage.Success);
                        break;
                    }
                case EnumRespone.Failse:
                    {
                        res.Success = false;
                        res.Message = Message.GetMessage(EnumMessage.Failse);
                        break;
                    }
                case EnumRespone.Exception:
                    {
                        res.Success = false;
                        res.Message = Message.GetMessage(EnumMessage.Exception);
                        break;
                    }
            }
            return res;
        }
        public static ActionResponse<T> CommonResponse<T>(EnumRespone responseEnum, T data)
        {
            var res = new ActionResponse<T>();
            switch (responseEnum)
            {
                case EnumRespone.Success:
                    {
                        res.Success = true;
                        res.Message = Message.GetMessage(EnumMessage.Success);
                        res.Data = data;
                        break;
                    }
                case EnumRespone.Exception:
                    {
                        res.Success = false;
                        res.Message = Message.GetMessage(EnumMessage.Exception);
                        break;
                    }
                default:
                    {
                        res.Success = false;
                        res.Message = Message.GetMessage(EnumMessage.Failse);
                        break;
                    }
            }
            return res;
        }
        public static ActionResponse<T> CommonResponseFalse<T>(string message)
        {
            var res = new ActionResponse<T>()
            {
                Success = false,
                Message = message
            };
            return res;
        }
    }
    public enum EnumRespone
    {
        Success,
        Failse,
        Exception
    }
}
