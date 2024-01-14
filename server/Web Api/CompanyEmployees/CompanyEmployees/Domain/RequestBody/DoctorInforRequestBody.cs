using CompanyEmployees.Domain.Enum;

namespace CompanyEmployees.Domain.RequestBody
{
    public class DoctorInforRequestBody : GetListRequestBody
    {
        public Guid? DepartmentId { get; set; }
        public EnumRank? Rank { get; set; }
        public EnumPosition? Position { get; set; }
    }
}
