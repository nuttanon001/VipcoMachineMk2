import { BaseModel } from "../../shared/base-model.model";

export interface NoTaskMachine extends BaseModel {
  NoTaskMachineId?: number;
  NoTaskMachineCode?: string;
  Description?: string;
  Remark?: string;
  Quantity?: number;
  Date?: Date;
  // FK
  // JobCardDetail
  JobCardDetailId?: number;
  // Employee
  AssignedBy?: string;
  // EmployeeGroup
  GroupCode?: string;
  // EmployeeGroupMis
  GroupMis?: string;
  // ViewModel
  AssignedByString?: string;
  GroupCodeString?: string;
  CuttingPlanNo?: string;
  GroupMisString?: string;
}
