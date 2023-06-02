using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using Dapper;
using Microsoft.Extensions.Logging;

namespace Contractr.Api.Services
{

    public class SqlHelper
    {
        readonly ILogger _log;

        public SqlHelper(ILogger log) {
            _log = log;
        }
        public string GenerateSQLWhereClauseForDynamicParmeters(object obj, bool terminateStatement)
        {
            StringBuilder sb = new StringBuilder();
            List<PropertyInfo> props = GetNonNullProperties(obj);
            //Strip out unneeded filters
            props.RemoveAll(p => p.Name.Contains("Page"));

            if (props.Count > 0)
            {
                var last = props.LastOrDefault();
                _log.LogInformation("Last object is {last}", last.Name);
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
                    _log.LogInformation("Processing Dynamic Parameters for key {p}", p.Name.ToString());
                    var value = p.GetValue(obj);
                    param.Add($"@{p.Name}", value.ToString());
                    _log.LogInformation("Successfully wrote Dynamic Parameters with value of {v}", value.ToString());
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
                if ( !(value is null))
                {
                    piList.Add(pi);
                }
            }
            return piList;
        }
    }
}