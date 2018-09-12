import { BaseModel } from "../../shared/base-model.model";

export interface TypeStandardTime extends BaseModel {
  TypeStandardTimeId: number;
  Name?: string;
  //Fk
  TypeMachineId?: number;
  //ViewModel
  TypeMachineString?: string;
}
