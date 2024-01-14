using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Common.ActionResponse
{
	public class ActionResponse : ActionResponse<object>
	{
		public ActionResponse() : base()
		{
			Data = "";
		}

		new public static ActionResponse CreateErrorResponse(int errorCode, string message = "")
		{
			return new ActionResponse
			{
				Success = false,
				Message = (string.IsNullOrEmpty(message) ? "Error!" : message),
				ErrorCode = errorCode,
				Data = ""
			};
		}
    new public static ActionResponse CreateErrorResponse(int errorCode, object message = null)
    {
      return new ActionResponse
      {
        Success = false,
        Message = $"Error",
        ErrorCode = errorCode,
        Data = message
      };
    }

    new public static ActionResponse CreateErrorResponse(string message)
		{
			return CreateErrorResponse(9997, message);
		}
    new public static ActionResponse CreateErrorResponse(object message)
    {
      return CreateErrorResponse(9997, message);
    }

    new public static ActionResponse CreateErrorResponse(Exception ex)
		{
			return CreateErrorResponse(9998, ex.Message + " - Error in: " + ex.StackTrace);
		}

		new public static ActionResponse CreateErrorResponseForInvalidRequest()
		{
			return CreateErrorResponse(9996, "Invalid request!");
		}

		new public static ActionResponse CreateSuccessResponse(string data, string message = "")
		{
			return new ActionResponse
			{
				Success = true,
				Message = string.IsNullOrEmpty(message) ? "Success!" : message,
				ErrorCode = 0,
				Data = data
			};
		}

		new public static ActionResponse CreateSuccessResponse(string message)
		{
			return new ActionResponse
			{
				Success = true,
				Message = string.IsNullOrEmpty(message) ? "Success!" : message,
				ErrorCode = 0
			};
		}

		new public static ActionResponse CreateSuccessResponse()
		{
			return CreateSuccessResponse("Success!");
		}
	}
}
