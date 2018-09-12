// angular core
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// 3rd party
import "rxjs/Rx";
import "hammerjs";
// services
import { DialogsService } from "./shared/dialogs.service";
// modules
import { CustomMaterialModule } from "../shared/customer-material.module";
import { SharedModule } from "../shared/shared.module";
// components
import { ErrorDialog } from "./error-dialog/error-dialog.component";
import { ContextDialog } from "./context-dialog/context-dialog.component";
import { ConfirmDialog } from "./confirm-dialog/confirm-dialog.component";
import { GroupDialogComponent } from "./group-dialog/group-dialog.component";
import { ProjectInfoComponent } from './project-dialog/project-info.component';
import { ProjectDialogComponent } from "./project-dialog/project-dialog.component";
import { GroupmisDialogComponent } from "./groupmis-dialog/groupmis-dialog.component";
import { EmployeeDialogComponent } from "./employee-dialog/employee-dialog.component";
import { GroupTableComponent } from "./group-dialog/groupmis-table/group-table.component";
import { ProjectSubInfoComponent } from './project-sub-dialog/project-sub-info.component';
import { ProjectSubDialogComponent } from './project-sub-dialog/project-sub-dialog.component';
import { ProjectTableComponent } from "./project-dialog/project-table/project-table.component";
import { CuttingPlanDialogComponent } from './cutting-plan-dialog/cutting-plan-dialog.component';
import { EmployeeTableComponent } from "./employee-dialog/employee-table/employee-table.component";
import { GroupmisTableComponent } from "./groupmis-dialog/groupmis-table/groupmis-table.component";
import { JobcardDetailInfoComponent } from './jobcard-detail-dialog/jobcard-detail-info.component';
import { JobcardMasterDialogComponent } from './jobcard-master-dialog/jobcard-master-dialog.component';
import { JobcardDetailDialogComponent } from './jobcard-detail-dialog/jobcard-detail-dialog.component';
import { TypeStandardtimeDialogComponent } from './type-standardtime-dialog/type-standardtime-dialog.component';
import { ProjectDetailTableComponent } from './project-dialog/project-detail-table/project-detail-table.component';
import { TypeStandardtimeInfoComponent } from './type-standardtime-dialog/type-standardtime-info/type-standardtime-info.component';
import { CuttingPlanInfoDialogComponent } from './cutting-plan-dialog/cutting-plan-info-dialog/cutting-plan-info-dialog.component';
import { TypeStandardtimeTableComponent } from './type-standardtime-dialog/type-standardtime-table/type-standardtime-table.component';
import { CuttingPlanTableDialogComponent } from './cutting-plan-dialog/cutting-plan-table-dialog/cutting-plan-table-dialog.component';
import { JobcardMasterViewExtendComponent } from './jobcard-master-dialog/jobcard-master-view-extend/jobcard-master-view-extend.component';
import { JobcardMasterTableExtendComponent } from './jobcard-master-dialog/jobcard-master-table-extend/jobcard-master-table-extend.component';
import { StandardTimeDialogComponent } from './standard-time-dialog/standard-time-dialog.component';
import { StandardTimeTableExtendComponent } from './standard-time-dialog/standard-time-table-extend/standard-time-table-extend.component';
import { StandardTimeInfoExtendComponent } from './standard-time-dialog/standard-time-info-extend/standard-time-info-extend.component';
import { ProgressTaskMachineDialogComponent } from './progress-task-machine-dialog/progress-task-machine-dialog.component';
import { ProgressTaskMachineInfoComponent } from './progress-task-machine-dialog/progress-task-machine-info/progress-task-machine-info.component';
import { MachineDialogComponent } from './machine-dialog/machine-dialog.component';
import { MachineTableExtendComponent } from './machine-dialog/machine-table-extend/machine-table-extend.component';
import { ChangeTypeMachineDialogComponent } from './change-type-machine-dialog/change-type-machine-dialog.component';
import { JobcardMasterDialogLmSmComponent } from "./jobcard-master-dialog/jobcard-master-dialog-lsms.component";
import { ConfirmMessageDialogComponent } from './confirm-message-dialog/confirm-message-dialog.component';
import { ManhourTaskMachineDialogComponent } from './manhour-task-machine-dialog/manhour-task-machine-dialog.component';
import { ManhourChangeComponent } from './manhour-task-machine-dialog/manhour-change/manhour-change.component';

@NgModule({
  imports: [
    // angular
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    // customer Module
    SharedModule,
    CustomMaterialModule,
  ],
  declarations: [
    ErrorDialog,
    ConfirmDialog,
    ContextDialog,
    EmployeeDialogComponent,
    EmployeeTableComponent,
    ProjectDialogComponent,
    ProjectTableComponent,
    //WorkgroupDialogComponent,
    GroupmisDialogComponent,
    GroupmisTableComponent,
    ProjectDetailTableComponent,
    ProjectInfoComponent,
    ProjectSubDialogComponent,
    ProjectSubInfoComponent,
    TypeStandardtimeDialogComponent,
    TypeStandardtimeInfoComponent,
    TypeStandardtimeTableComponent,
    JobcardDetailDialogComponent,
    JobcardDetailInfoComponent,
    CuttingPlanDialogComponent,
    CuttingPlanTableDialogComponent,
    CuttingPlanInfoDialogComponent,
    GroupDialogComponent,
    GroupTableComponent,
    JobcardMasterDialogComponent,
    JobcardMasterDialogLmSmComponent,
    JobcardMasterViewExtendComponent,
    JobcardMasterTableExtendComponent,
    StandardTimeDialogComponent,
    StandardTimeTableExtendComponent,
    StandardTimeInfoExtendComponent,
    ProgressTaskMachineDialogComponent,
    ProgressTaskMachineInfoComponent,
    MachineDialogComponent,
    MachineTableExtendComponent,
    ChangeTypeMachineDialogComponent,
    ConfirmMessageDialogComponent,
    ManhourTaskMachineDialogComponent,
    ManhourChangeComponent,
  ],
  providers: [
    DialogsService,
  ],
  // a list of components that are not referenced in a reachable component template.
  // doc url is :https://angular.io/guide/ngmodule-faq
  entryComponents: [
    ErrorDialog,
    ConfirmDialog,
    ContextDialog,
    GroupmisTableComponent,
    ProjectDialogComponent,
    EmployeeDialogComponent,
    GroupmisDialogComponent,
    ProjectDetailTableComponent,
    ProjectInfoComponent,
    ProjectSubDialogComponent,
    ProjectSubInfoComponent,
    TypeStandardtimeDialogComponent,
    TypeStandardtimeInfoComponent,
    TypeStandardtimeTableComponent,
    JobcardDetailDialogComponent,
    JobcardDetailInfoComponent,
    CuttingPlanDialogComponent,
    CuttingPlanTableDialogComponent,
    CuttingPlanInfoDialogComponent,
    GroupDialogComponent,
    GroupTableComponent,
    JobcardMasterDialogComponent,
    JobcardMasterDialogLmSmComponent,
    JobcardMasterViewExtendComponent,
    JobcardMasterTableExtendComponent,
    StandardTimeDialogComponent,
    StandardTimeTableExtendComponent,
    StandardTimeInfoExtendComponent,
    ProgressTaskMachineDialogComponent,
    ProgressTaskMachineInfoComponent,
    MachineDialogComponent,
    MachineTableExtendComponent,
    ChangeTypeMachineDialogComponent,
    ConfirmMessageDialogComponent,
    ManhourTaskMachineDialogComponent,
    ManhourChangeComponent,
  ],
})
export class DialogsModule { }
