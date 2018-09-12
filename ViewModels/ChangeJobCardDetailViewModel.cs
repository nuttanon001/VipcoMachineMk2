using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VipcoMachine.ViewModels
{
    public class ChangeJobCardDetailViewModel
    {
        public int? JobcardDetailId { get; set; }
        public int? TypeMachineId { get; set; }
        public string ChangeBy { get; set; }
    }
}
