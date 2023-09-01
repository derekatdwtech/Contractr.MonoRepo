using System.Diagnostics;
using System.Reflection;
using System.Text;
using Dapper;

namespace Contractr.Converter.Services
{

    public class SqlHelper
    {
        public string GenerateSQLWhereClauseForDynamicParmeters(object obj, bool terminateStatement)
        {
            StringBuilder sb = new StringBuilder();
            List<PropertyInfo> props = GetNonNullProperties(obj);
            //Strip out unneeded filters
            props.RemoveAll(p => p.Name.Contains("Page"));

            if (props.Count > 0)
            {
                var last = props.LastOrDefault();
                Console.WriteLine("Last object is {last}", last.Name);
                foreach (var pi in props)
                {

                    if (terminateStatement && pi == last)
                    {
                        if (pi.Name.Contains("Date") && pi.Name == "startDate")
                        {
                            sb.Append($"date >= @{pi.Name};");
                        }
                        else if (pi.Name.Contains("Date") && pi.Name == "endDate")
                        {
                            sb.Append($"date <= @{pi.Name};");
                        }
                        else
                        {
                            sb.Append($"{pi.Name} LIKE '%' + @{pi.Name} + '%';");
                        }


                    }
                    else if (!terminateStatement && pi == last)
                    {
                        if (pi.Name.Contains("Date") && pi.Name == "startDate")
                        {
                            sb.Append($"date >= @{pi.Name} ");
                        }
                        else if (pi.Name.Contains("Date") && pi.Name == "endDate")
                        {
                            sb.Append($"date <= @{pi.Name} ");
                        }
                        else
                        {
                            sb.Append($"{pi.Name} LIKE '%' + @{pi.Name} + '%' ");
                        }
                    }
                    else
                    {
                        if (pi.Name.Contains("Date") && pi.Name == "startDate")
                        {
                            sb.Append($"date >= @{pi.Name} AND ");
                        }
                        else if (pi.Name.Contains("Date") && pi.Name == "endDate")
                        {
                            sb.Append($"date <= @{pi.Name} AND ");
                        }
                        else
                        {
                            sb.Append($"{pi.Name} LIKE '%' + @{pi.Name} + '%' AND ");
                        }
                    }

                }
            }

            if (sb.Length > 0)
            {
                sb.Insert(0, "WHERE ");
                return sb.ToString();
            }
            else
            {
                return "";
            }
        }

        public DynamicParameters GetDynamicParameters(object obj)
        {
            DynamicParameters param = new DynamicParameters();
            // Get Non-Null properties
            var props = GetNonNullProperties(obj);
            // Filter out stuff we dont need
            foreach (var p in props)
            {
                if (p.Name != "PageSize" && p.Name != "PageNumber" && !String.IsNullOrWhiteSpace(p.Name))
                {
                    Console.WriteLine($" ....... Processing Dynamic Parameters for key {p.Name.ToString()}");
                    var value = p.GetValue(obj);
                    param.Add($"@{p.Name}", value.ToString());
                    Console.WriteLine($" ....... Successfully wrote Dynamic Parameters {p.Name} : {value.ToString()}");
                }

            }

            return param;
        }

        private List<PropertyInfo> GetNonNullProperties(object obj)
        {
            List<PropertyInfo> piList = new List<PropertyInfo>();
            PropertyInfo[] properties = obj.GetType().GetProperties();
            foreach (PropertyInfo pi in properties)
            {
                var value = pi.GetValue(obj);
                if (!(value is null))
                {
                    piList.Add(pi);
                }
            }
            return piList;
        }
    }
}