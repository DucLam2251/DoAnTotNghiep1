namespace CompanyEmployees.Domain.DTO
{
    public class MedicineDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public int HealthInsurancePayments { get; set; }
        public float Price { get; set; }
        public string Description { get; set; }
    }
    public class CreateMedicineRequest 
    {
        public string Title { get; set; }
        public int HealthInsurancePayments { get; set; }
        public float Price { get; set; }
        public string Description { get; set; }
    }
}
