import { BaseModel } from "../../shared/base-model.model";
import { JobcardDetailStatus } from "./jobcard-detail-status.enum";

export interface JobcardDetail extends BaseModel {
  JobCardDetailId?: number;
  Material?: string;
  Quality?: number;
  UnitNo?: number;
  JobCardDetailStatus?: JobcardDetailStatus;
  Remark?: string;
  // Fk
  JobCardMasterId?: number;
  UnitMeasureId?: number;
  StandardTimeId?: number;
  CuttingPlanId?: number;
  //ViewModel
  CuttingPlanString?: string;
  StandardTimeString?: string;
  FullNameString?: string;
  JobMasterNoString?: string;
  TypeMachineString?: string;
  //ReadOnly
  StatusString?: string;
  SplitFormJobCardId?: number;
  SplitQuality?: number;
}
