using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Common.ActionResponse
{
	public class ActionResponse<TPayload>
	{
		[JsonProperty("success")]
		public bool Success { get; set; }

		[JsonProperty("code")]
		public int ErrorCode { get; set; }

		[JsonProperty("message")]
		public string Message { get; set; }

		[JsonProperty("data")]
		public TPayload Data { get; set; }

		public ActionResponse()
		{
			Success = false;
			ErrorCode = 0;
			Message = "";
			Data = default(TPayload);
		}

		public static ActionResponse<TPayload> CreateErrorResponse(int errorCode, string message = "")
		{
			return new ActionResponse<TPayload>
			{
				Success = false,
				Message = (string.IsNullOrEmpty(message) ? "Error!" : message),
				ErrorCode = errorCode,
				Data = default(TPayload)
			};
		}

		public static ActionResponse<TPayload> CreateErrorResponse(int errorCode, TPayload data, string message = "")
		{
			return new ActionResponse<TPayload>
			{
				Success = false,
				Message = (string.IsNullOrEmpty(message) ? "Error!" : message),
				ErrorCode = errorCode,
				Data = data
			};
		}
    public static ActionResponse<TPayload> CreateErrorResponse(int errorCode, TPayload data, object message = null)
    {
      return new ActionResponse<TPayload>
      {
        Success = false,
        Message = $"Error!:{message}",
        ErrorCode = errorCode,
        Data = data
      };
    }

    public static ActionResponse<TPayload> CreateErrorResponse(string message)
		{
			return CreateErrorResponse(9997, message);
		}

		public static ActionResponse<TPayload> CreateErrorResponse(Exception ex)
		{
			return CreateErrorResponse(9998, ex.Message + " - Error in: " + ex.StackTrace);
		}

		public static ActionResponse<TPayload> CreateErrorResponseForInvalidRequest()
		{
			return CreateErrorResponse(9996, "Invalid request!");
		}

		public static ActionResponse<TPayload> CreateSuccessResponse(int errorCode, TPayload data, string message = "")
		{
			return new ActionResponse<TPayload>
			{
				Success = true,
				Message = string.IsNullOrEmpty(message) ? "Success!" : message,
				ErrorCode = errorCode,
				Data = data
			};
		}

		public static ActionResponse<TPayload> CreateSuccessResponse(int errorCode, string message)
		{
			return new ActionResponse<TPayload>
			{
				Success = true,
				Message = string.IsNullOrEmpty(message) ? "Success!" : message,
				ErrorCode = errorCode
			};
		}

		public static ActionResponse<TPayload> CreateSuccessResponse(TPayload data, string message = "")
		{
			return CreateSuccessResponse(0, data, message);
		}

		public static ActionResponse<TPayload> CreateSuccessResponse(string message)
		{
			return CreateSuccessResponse(0, message);
		}

		public static ActionResponse<TPayload> CreateSuccessResponse()
		{
			return CreateSuccessResponse("Success!");
		}
	}
}
