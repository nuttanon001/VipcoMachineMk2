import { BaseModel } from "../../shared/base-model.model";
import { JobcardDetail } from "./jobcard-detail.model";
import { JobcardMasterStatus } from "./jobcard-master-status.enum";

export interface JobcardMaster extends BaseModel {
  JobCardMasterId: number;
  JobCardMasterNo?: string;
  JobCardMasterStatus?: JobcardMasterStatus;
  Description?: string;
  Remark?: string;
  JobCardDate?: Date;
  DueDate?: Date;
  MailReply?: string;
  //Fk
  EmpWrite?: string;
  EmpRequire?: string;
  GroupCode?: string;
  ProjectCodeDetailId?: number;
  TypeMachineId?: number;
  JobCardDetails?: Array<JobcardDetail>;
  //ViewModel
  ProjectDetailString?: string;
  TypeMachineString?: string;
  StatusString?: string;
  EmployeeRequireString?: string;
  EmployeeWriteString?: string;
  //Attach
  AttachFile?: FileList;
  RemoveAttach?: Array<number>;
  // Option
  MachineUser?: boolean;
}
