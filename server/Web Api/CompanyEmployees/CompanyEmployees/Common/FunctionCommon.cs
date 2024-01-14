using CompanyEmployees.Domain.Enum;
using CompanyEmployees.Domain.RequestBody;
using System.Linq.Dynamic.Core;

namespace CompanyEmployees.service.Service
{
    public class FunctionCommon
    {
        public static void CopyNonNullProperties<T>(T addValue, T oldValue)
        {
            var properties = typeof(T).GetProperties();

            foreach (var property in properties)
            {
                var sourceValue = new object();
                var destinationValue = new object();
                try
                {
                    sourceValue = property.GetValue(addValue);
                    destinationValue = property.GetValue(oldValue);
                }
                catch
                {
                    continue;
                }
                if (property.PropertyType == typeof(Guid))
                {
                    if ((Guid)sourceValue != Guid.Empty)
                    {
                        property.SetValue(oldValue, sourceValue);
                        continue;
                    }
                    else continue;

                }
                if (property.PropertyType == typeof(int))
                {
                    if ((int)sourceValue != 0)
                    {
                        property.SetValue(oldValue, sourceValue);
                        continue;

                    }
                    else continue;

                }
                if (property.PropertyType == typeof(float))
                {
                    if ((float)sourceValue != 0)
                    {
                        property.SetValue(oldValue, sourceValue);
                        continue;

                    }
                    else continue;

                }
                if (property.PropertyType == typeof(DateTimeOffset))
                {
                    if ((DateTimeOffset)sourceValue != DateTimeOffset.MinValue && (DateTimeOffset)sourceValue != DateTimeOffset.MaxValue)
                    {
                        property.SetValue(oldValue, sourceValue);
                        continue;

                    }
                    else continue;

                }
                if (sourceValue != null && !sourceValue.Equals(destinationValue))
                {
                    property.SetValue(oldValue, sourceValue);
                    continue;

                }
            }
        }
        public static RoleEnum StringToRoleEnum(string Str)
        {
            switch (Str)
            {
                case "Doctor":
                    return RoleEnum.Doctor;
                case "Patient":
                    return RoleEnum.Patient;
                case "Administrator":
                    return RoleEnum.Administrator;
                case "Nurse":
                    return RoleEnum.Nurse;
                default:
                    throw new ArgumentException("The account does not have a role");
            }
        }
        public static IQueryable<T> OrderbyCommon<T, Q>(IQueryable<T> Query, Q requestBody)
            where Q : GetListRequestBody
        {
            if(requestBody.isAssending != null && requestBody.orderBy != null)
            {
                if ((bool)requestBody.isAssending)
                {
                    Query = Query.OrderBy(requestBody.orderBy);
                }
                else
                {
                    Query = Query.OrderBy($"{requestBody.orderBy} descending");
                }
            }
            return Query;
        }
    }
}
