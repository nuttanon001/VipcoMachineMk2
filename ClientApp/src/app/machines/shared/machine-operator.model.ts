import { BaseModel } from "../../shared/base-model.model";

export interface MachineOperator extends BaseModel {
  MachineOperatorId?: number;
  Remark?: string;
  //Fk
  EmpCode?: string;
  MachineId?: number;
  //ViewModel
  EmployeeString?: string;
}
