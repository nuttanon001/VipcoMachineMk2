using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.ViewModels
{
    public class AutoComplateViewModel
    {
        public string ByColumn { get; set; }
        public string Filter { get; set; }
    }

    public class ResultAutoComplateViewModel
    {
        public string AutoComplate { get; set; }
    }
}
