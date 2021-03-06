﻿using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VipcoMachine.Models
{
    public class TaskMachine:BaseModel
    {
        [Key]
        public int TaskMachineId { get; set; }
        [StringLength(50)]
        public string TaskMachineName { get; set; }
        [StringLength(200)]
        public string Description { get; set; }
        public TaskMachineStatus? TaskMachineStatus { get; set; }
        public int? Priority { get; set; }
        // Quantity of material is send to task
        public double? TotalQuantity { get; set; }
        // Quantity current already product
        public double? CurrentQuantity { get; set; }
        public double? Weight { get; set; }
        public DateTime PlannedStartDate { get; set; }
        public DateTime PlannedEndDate { get; set; }
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public DateTime? TaskDueDate { get; set; }
        public double? PlanManHours { get; set; }
        public double? ActualManHours { get; set; }
        public int? HasOverTime { get; set; }
        [StringLength(200)]
        public string ReceiveBy { get; set; }
        // FK
        // Machine
        public int? MachineId { get; set; }
        public Machine Machine { get; set; }
        // JobCardDetail
        [Required]
        public int JobCardDetailId { get; set; }
        public JobCardDetail JobCardDetail { get; set; }
        // Employee
        public string AssignedBy { get; set; }
        [ForeignKey("AssignedBy")]
        public Employee Employee { get; set; }
        //TaskMachine
        public int? PrecedingTaskMachineId { get; set; }
        [ForeignKey("PrecedingTaskMachineId")]
        public TaskMachine PrecedingTaskMachine { get; set; }
        // TaskMachineHasOverTime
        public ICollection<TaskMachineHasOverTime> TaskMachineHasOverTimes { get; set; } = new List<TaskMachineHasOverTime>();
        // ProgressTaskMachine
        public ICollection<ProgressTaskMachine> ProgressTaskMachines { get; set; } = new List<ProgressTaskMachine>();
        // StandardTime
        public int? StandardTimeId { get; set; }
        public StandardTime StandardTime { get; set; }
    }

    public enum TaskMachineStatus
    {
        Wait = 1,
        Process = 2,
        Complate = 3,
        Cancel = 4
    }
}
