namespace CompanyEmployees.Domain.RequestBody
{
    public class ChartRequestBody
    {
    }
    public class GetChartNumberApp
    {
        public DateTimeOffset Start { get; set; }
        public DateTimeOffset End { get; set; }
        public bool IsMonthly { get; set; }
    }
    public class GetNumberOfAppointmentOnDepartmentRequestBody
    {
        public DateTimeOffset Date { get; set; }
        public OrderbyTimeEnum Order { get; set; }
    }
    public class chartNumberDTO
    {
        public int? count { get; set; }
        public DateTimeOffset? dateTime { get; set; }
    }
    public class GetNumberOfAppointmentOnDepartment
    {
        public int count { get; set; }
        public string name { get; set; }
    }
    public enum OrderbyTimeEnum
    {
        Day, 
        Month,
        Quarter,
        Year
    }
}
