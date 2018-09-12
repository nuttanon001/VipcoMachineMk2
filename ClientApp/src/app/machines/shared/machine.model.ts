import { BaseModel } from "../../shared/base-model.model";
import { MachineOperator } from "./machine-operator.model";

export interface Machine extends BaseModel {
  MachineId: number;
  MachineCode?: string;
  MachineName?: string;
  InstalledDate?: Date;
  Model?: string;
  Brand?: string;
  MachineImage?: Array<number>;
  MachineImageString?: string;
  Remark?: string;
  MachineStatus?: number;
  // Fk
  TypeMachineId?: number;
  // Relation
  MachineHasOperators?: Array<MachineOperator>;
  // ViewModel
  TypeMachineString?: string;
}
