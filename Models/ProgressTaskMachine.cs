using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace VipcoMachine.Models
{
    public class ProgressTaskMachine:BaseModel
    {
        [Key]
        public int ProgressId { get; set; }
        public double? Quantity { get; set; }
        public double? Weight { get; set; }
        public DateTime? ProgressDate { get; set; }
        public ProgressTaskMachineStatus? ProgressTaskMachineStatus { get; set; }
        // FK
        //TaskMachine
        public int? TaskMachineId { get; set; }
        // public TaskMachine TaskMachine { get; set; }
    }

    public enum ProgressTaskMachineStatus
    {
        Use = 1,
        Cancel
    }
}
