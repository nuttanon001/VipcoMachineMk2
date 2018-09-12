import { BaseModel } from "../../shared/base-model.model";
import { ProjectSub } from "./project-sub.model";

export interface ProjectMaster extends BaseModel {
  ProjectCodeMasterId: number;
  ProjectCode?: string;
  ProjectName?: string;
  StartDate?: Date;
  EndDate?: Date;
  ProjectCodeDetails?: Array<ProjectSub>;
  // ViewModel
  ProjectCodeSub?: ProjectSub;
}
