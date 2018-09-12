import { BaseModel } from "../../shared/base-model.model";

export interface TypeMachine extends BaseModel {
  TypeMachineId?: number;
  TypeMachineCode?: string;
  Name?: string;
  Description?: string;
  Remark?: string;
}
