import { BaseModel } from "../../shared/base-model.model";
import { ProgressTaskMachineStatus } from "./progress-task-machine-status.enum";

export interface ProgressTaskMachine extends BaseModel {
  ProgressId?: number;
  Quantity?: number;
  Weight?: number;
  ProgressDate?: Date;
  ProgressTaskMachineStatus?: ProgressTaskMachineStatus;
  // FK
  TaskMachineId?: number;
  // ViewModel
  ProgressDateTime?: Date;
  ProgressDateTimeString?: any;
  ProgressTaskMachineStatusString?: string;
  MaxQuantity?: number;
}
