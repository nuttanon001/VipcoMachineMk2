using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.ViewModels
{
    public class ScrollViewModel
    {
        //The Skip number
        public int? Skip { get; set; }
        //The Take number
        public int? Take { get; set; }
        public string SortField { get; set; }
        public int? SortOrder { get; set; }
        public string Filter { get; set; }
        public bool? Reload { get; set; }
        public string Where { get; set; }
        public int? WhereId { get; set; }
        public string Where2 { get; set; }
        public int? WhereId2 { get; set; }
        public string Where3 { get; set; }
        public int? WhereId3 { get; set; }
        public string Where4 { get; set; }
        public int? WhereId4 { get; set; }
        public string Where5 { get; set; }
        public int? WhereId5 { get; set; }
        public int? TotalRow { get; set; }
        public DateTime? SDate { get; set; }
        public DateTime? EDate { get; set; }
        public ScheduleStatus? ScheduleStatus { get; set; }
    }

    public enum ScheduleStatus
    {
        WaitAndProgress = 1,
        Complate,
        All
    }
}
