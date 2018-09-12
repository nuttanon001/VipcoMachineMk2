import { BaseModel } from "../../shared/base-model.model";

export interface StandardTime extends BaseModel {
  StandardTimeId: number;
  StandardTimeCode?: string;
  Description?: string;
  Remark?: string;
  StandardTimeValue?: number;
  PreparationBefor?: number;
  PreparationAfter?: number;
  CalculatorTime?: number;
  //Fk
  GradeMaterialId?: number;
  TypeStandardTimeId?: number;
  // viewmodels
  GradeMaterialString?: string;
  TypeStandardTimeString?: string;
}
