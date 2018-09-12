export interface JobcardSchedule {
  Filter?: string;
  TypeMachineId?: number;
  ProjectMasterId?: number;
  ProjectDetailId?: number;
  FullProjectString?: string;
  Skip?: number;
  Take?: number;
  Mode?: number;
  Creator?: string;
  Require?: string;
  TaskMachineId?: number;
  MachineId?: number;
  // template
  CreatorName?: string;
  RequireName?: string;
  PickDate?: Date;
}
