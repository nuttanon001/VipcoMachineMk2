import { BaseModel } from "../../shared/base-model.model";
import { ProgressTaskMachine } from "./progress-task-machine.model";
import { TaskMachineStatus } from "./task-machine-status.enum";

export interface TaskMachine extends BaseModel {
  TaskMachineId?: number;
  TaskMachineName?: string;
  Description?: string;
  TaskMachineStatus?: TaskMachineStatus;
  Priority?: number;
  // Quantity of material is send to task
  TotalQuantity?: number;
  // Quantity current already product
  CurrentQuantity?: number;
  Weight?: number;
  PlannedStartDate?: Date;
  PlannedEndDate?: Date;
  ActualStartDate?: Date;
  ActualEndDate?: Date;
  PlanManHours?: number;
  ActualManHours?: number;
  TaskDueDate?: Date;
  HasOverTime?: number;
  ReceiveBy?:string;
  // FK
  // Standard
  StandardTimeId?: number;
  // Machine
  MachineId?: number;
  // JobCardDetail
  JobCardDetailId?: number;
  // Employee
  AssignedBy?: string;
  //TaskMachine
  PrecedingTaskMachineId?: number;
  // TaskMachineHasOverTime
  // ProgressTaskMachine
  ProgressTaskMachines?: Array<ProgressTaskMachine>;
  // ViewModel
  MachineString?: string;
  CuttingPlanNo?: string;
  StandardTimeString?: string;
  AssignedByString?: string;
  TaskMachineStatusString?: string;
  // Option
  IsProgress?: boolean;
}
