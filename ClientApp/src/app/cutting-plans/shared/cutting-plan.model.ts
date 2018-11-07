import { BaseModel } from "../../shared/base-model.model";
import { TypeCuttingPlan } from "./type-cutting-plan.enum";

export interface CuttingPlan extends BaseModel {
  CuttingPlanId: number;
  CuttingPlanNo?: string;
  Description?: string;
  Quantity?: number;
  MaterialSize?: string;
  MaterialGrade?: string;
  TypeCuttingPlan?: TypeCuttingPlan;
  Weight?: number;
  //FK
  ProjectCodeDetailId?: number;
  //ViewModel
  ProjectCodeString?: string;
  TypeCuttingPlanString?: string;
  CreateNameThai?: string;
}
