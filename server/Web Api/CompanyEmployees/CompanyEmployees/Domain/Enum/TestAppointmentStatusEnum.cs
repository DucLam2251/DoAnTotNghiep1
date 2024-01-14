namespace CompanyEmployees.Domain.Enum
{
    public enum AppointmentStatusEnum
    {
            PendingConfirm, // đợi xác nhận từ quản trị
            New, // đã được xác nhận
            Reject, // từ chối 
            Inprogress, // thao tác
            OnBoard, // nhập viện
            Success // thành công
    }
}
