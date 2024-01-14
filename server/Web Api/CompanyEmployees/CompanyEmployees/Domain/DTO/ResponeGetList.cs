namespace CompanyEmployees.Domain.DTO
{
    public class ResponeGetList<T>
    {
        public List<T> Values { get; set; }
        public int Total { get; set; }
    }
}
