// Angular Core
import { MatDialogRef, MatDialog, MatDialogConfig } from "@angular/material";
import { Injectable, ViewContainerRef } from "@angular/core";
// rxjs
import { Observable } from "rxjs";
// module
import { Employee } from "../../employees/shared/employee.model";
import { ProjectSub } from "../../projects/shared/project-sub.model";
import { ProjectMaster } from "../../projects/shared/project-master.model";
import { EmployeeGroupMis } from "../../employees/shared/employee-group-mis.model";
// components
import { ErrorDialog } from "../error-dialog/error-dialog.component";
import { ConfirmDialog } from "../confirm-dialog/confirm-dialog.component";
import { ContextDialog } from "../context-dialog/context-dialog.component";
import { ProjectDialogComponent } from "../project-dialog/project-dialog.component";
import { GroupmisDialogComponent } from "../groupmis-dialog/groupmis-dialog.component";
import { EmployeeDialogComponent } from "../employee-dialog/employee-dialog.component";
import { ProjectSubDialogComponent } from "../project-sub-dialog/project-sub-dialog.component";
import { TypeStandardtimeDialogComponent } from "../type-standardtime-dialog/type-standardtime-dialog.component";
import { TypeStandardTime } from "../../standard-times/shared/type-standard-time.model";
import { CuttingPlan } from "../../cutting-plans/shared/cutting-plan.model";
import { CuttingPlanDialogComponent } from "../cutting-plan-dialog/cutting-plan-dialog.component";
import { JobcardDetailDialogComponent } from "../jobcard-detail-dialog/jobcard-detail-dialog.component";
import { JobcardDetail } from "../../jobcard-masters/shared/jobcard-detail.model";
import { EmployeeGroup } from "../../employees/shared/employee-group.model";
import { GroupDialogComponent } from "../group-dialog/group-dialog.component";
import { JobcardMaster } from "../../jobcard-masters/shared/jobcard-master.model";
import { JobcardMasterDialogComponent } from "../jobcard-master-dialog/jobcard-master-dialog.component";
import { StandardTime } from "../../standard-times/shared/standard-time.model";
import { StandardTimeDialogComponent } from "../standard-time-dialog/standard-time-dialog.component";
import { ProgressTaskMachine } from "../../task-machines/shared/progress-task-machine.model";
import { ProgressTaskMachineDialogComponent } from "../progress-task-machine-dialog/progress-task-machine-dialog.component";
import { Machine } from "../../machines/shared/machine.model";
import { MachineDialogComponent } from "../machine-dialog/machine-dialog.component";
import { TypeMachine } from "../../machines/shared/type-machine.model";
import { ChangeTypeMachineDialogComponent } from "../change-type-machine-dialog/change-type-machine-dialog.component";
import { JobcardMasterDialogLmSmComponent } from "../jobcard-master-dialog/jobcard-master-dialog-lsms.component";
import { ConfirmMessageDialogComponent } from "../confirm-message-dialog/confirm-message-dialog.component";
import { TaskMachine } from "../../task-machines/shared/task-machine.model";
import { ManhourTaskMachineDialogComponent } from "../manhour-task-machine-dialog/manhour-task-machine-dialog.component";

@Injectable()
export class DialogsService {
  // width and height > width and height in scss master-dialog
  width: string = "80vh";
  height: string = "80vw";

  constructor(private dialog: MatDialog) { }

  public confirm(title: string, message: string, viewContainerRef: ViewContainerRef): Observable<boolean> {

    let dialogRef: MatDialogRef<ConfirmDialog>;
    let config: MatDialogConfig = new MatDialogConfig();
    config.viewContainerRef = viewContainerRef;

    dialogRef = this.dialog.open(ConfirmDialog, config);

    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }

  public context(title: string, message: string, viewContainerRef: ViewContainerRef): Observable<boolean> {

    let dialogRef: MatDialogRef<ContextDialog>;
    let config: MatDialogConfig = new MatDialogConfig();
    config.viewContainerRef = viewContainerRef;

    dialogRef = this.dialog.open(ContextDialog, config);

    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }

  public error(title: string, message: string, viewContainerRef: ViewContainerRef): Observable<boolean> {

    let dialogRef: MatDialogRef<ErrorDialog>;
    let config: MatDialogConfig = new MatDialogConfig();
    config.viewContainerRef = viewContainerRef;

    dialogRef = this.dialog.open(ErrorDialog, config);

    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }

  public confirmMessage(title: string, message: string, viewContainerRef: ViewContainerRef): Observable<{ result: boolean, message: string }> {

    let dialogRef: MatDialogRef<ConfirmMessageDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();
    config.viewContainerRef = viewContainerRef;

    dialogRef = this.dialog.open(ConfirmMessageDialogComponent, config);

    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }

  /**
   * 
   * @param viewContainerRef
   * @param type = mode of project dialog
   */
  public dialogSelectProject(viewContainerRef: ViewContainerRef, type: number = 0): Observable<ProjectMaster | ProjectSub> {
    let dialogRef: MatDialogRef<ProjectDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = type;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(ProjectDialogComponent, config);
    return dialogRef.afterClosed();
  }
  /**
   * Group Mis
   * @param viewContainerRef
   * @param type = mode 0:fastSelected
   */
  public dialogSelectGroupMis(viewContainerRef: ViewContainerRef, type: number = 0): Observable<EmployeeGroupMis> {
    let dialogRef: MatDialogRef<GroupmisDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = type;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(GroupmisDialogComponent, config);
    return dialogRef.afterClosed();
  }
  /**
   * Group Mis
   * @param viewContainerRef
   * @param type = mode 0:fastSelected
   */
  public dialogSelectGroupMises(viewContainerRef: ViewContainerRef, type: number = 1): Observable<Array<EmployeeGroupMis>> {
    let dialogRef: MatDialogRef<GroupmisDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = type;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(GroupmisDialogComponent, config);
    return dialogRef.afterClosed();
  }
  /**
   * @param viewContainerRef
   * @param type = mode 0:fastSelected
   */
  public dialogSelectEmployee(viewContainerRef: ViewContainerRef, type: number = 0): Observable<Employee> {
    let dialogRef: MatDialogRef<EmployeeDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = type;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(EmployeeDialogComponent, config);
    return dialogRef.afterClosed();
  }
  /**
   * @param viewContainerRef
   * @param type = mode 0:fastSelected
   */
  public dialogSelectEmployees(viewContainerRef: ViewContainerRef, type: number = 1): Observable<Array<Employee>> {
    let dialogRef: MatDialogRef<EmployeeDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = type;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(EmployeeDialogComponent, config);
    return dialogRef.afterClosed();
  }
  /**
   * @param viewContainerRef
   * @param projectSub = ProjectSub
   */
  public dialogProjectSubInfo(viewContainerRef: ViewContainerRef, projectSub: ProjectSub = undefined): Observable<ProjectSub> {
    let dialogRef: MatDialogRef<ProjectSubDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = projectSub;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(ProjectSubDialogComponent, config);
    return dialogRef.afterClosed();
  }

  /**
  * @param viewContainerRef
  * @param type = mode 0:fastSelected
  */
  public dialogInfoTypeStandardTime(viewContainerRef: ViewContainerRef, mode: number = 0): Observable<TypeStandardTime> {
    let dialogRef: MatDialogRef<TypeStandardtimeDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = mode;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(TypeStandardtimeDialogComponent, config);
    return dialogRef.afterClosed();
  }

  /**
  * @param viewContainerRef
  * @param type = mode 0:fastSelected
  */
  public dialogInfoCuttingPlan(viewContainerRef: ViewContainerRef, mode: number = 0): Observable<CuttingPlan> {
    let dialogRef: MatDialogRef<CuttingPlanDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = mode;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(CuttingPlanDialogComponent, config);
    return dialogRef.afterClosed();
  }

  /**
 * @param viewContainerRefJobcardDetailDialogComponent
 * @param type = mode 0:fastSelected
 */
  public dialogInfoJobCardDetail(viewContainerRef: ViewContainerRef, jobDetail: JobcardDetail = undefined, split:boolean = false): Observable<JobcardDetail> {
    let dialogRef: MatDialogRef<JobcardDetailDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = { data: jobDetail, option: split };
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(JobcardDetailDialogComponent, config);
    return dialogRef.afterClosed();
  }

  /**
 * Group
 * @param viewContainerRef
 * @param type = mode 0:fastSelected
 */
  public dialogSelectGroup(viewContainerRef: ViewContainerRef, type: number = 0): Observable<EmployeeGroup|Array<EmployeeGroup>> {
    let dialogRef: MatDialogRef<GroupDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = type;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(GroupDialogComponent, config);
    return dialogRef.afterClosed();
  }

  /**
  * JobCardMasterDialogs
   * @param jobCardDetail
   * @param viewContainerRef
   * @param ShowCommand
  */
  public dialogSelectRequireMachine(jobCardDetail: JobcardDetail, viewContainerRef: ViewContainerRef, ShowCommand: boolean = true): Observable<number> {
    let dialogRef: MatDialogRef<JobcardMasterDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    let data: { infoValue: JobcardDetail, ShowCommand: boolean };
    data = {
      infoValue: jobCardDetail,
      ShowCommand: ShowCommand
    };
    // config
    config.viewContainerRef = viewContainerRef;
    config.data = data;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(JobcardMasterDialogComponent, config);
    return dialogRef.afterClosed();
  }

  /**
  * JobCardMasterDialogs
   * @param jobCardDetail
   * @param viewContainerRef
   * @param ShowCommand
  */
  public dialogSelectRequireMachineLmSm(jobcardMaster: JobcardMaster, viewContainerRef: ViewContainerRef, ShowCommand: boolean = true): Observable<JobcardDetail> {
    let dialogRef: MatDialogRef<JobcardMasterDialogLmSmComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    let data: { infoValue: JobcardMaster, ShowCommand: boolean };
    data = {
      infoValue: jobcardMaster,
      ShowCommand: ShowCommand
    };
    // config
    config.viewContainerRef = viewContainerRef;
    config.data = data;
    // config.height = this.height;
    // config.width= this.width;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(JobcardMasterDialogLmSmComponent, config);
    return dialogRef.afterClosed();
  }

  /**
  * StandardTime
  * @param viewContainerRef
  * @param type = mode 0:fastSelected
  */
  public dialogSelectStandardTime(viewContainerRef: ViewContainerRef, type: number = 0): Observable<StandardTime> {
    let dialogRef: MatDialogRef<StandardTimeDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();
    // config
    config.viewContainerRef = viewContainerRef;
    config.data = type;
    config.hasBackdrop = true;
    // open dialog
    dialogRef = this.dialog.open(StandardTimeDialogComponent, config);
    return dialogRef.afterClosed();
  }


  /**
 * @param viewContainerRef
 * @param type = mode 0:fastSelected
 */
  public dialogInfoProgressTaskMachine(viewContainerRef: ViewContainerRef, Progress: ProgressTaskMachine = undefined): Observable<ProgressTaskMachine> {
    let dialogRef: MatDialogRef<ProgressTaskMachineDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = Progress;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(ProgressTaskMachineDialogComponent, config);
    return dialogRef.afterClosed();
  }

  /**
   * Machine no
   * @param viewContainerRef
   * @param data = { mode: number, TypeMachineId: number }
   */
  public dialogSelectMachines(viewContainerRef: ViewContainerRef, data: { mode: number, TypeMachineId: number }): Observable<Machine|Array<Machine>> {
    let dialogRef: MatDialogRef<MachineDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = data;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(MachineDialogComponent, config);
    return dialogRef.afterClosed();
  }

  /**
   * Change machine group for jobcarddetail
   * @param viewContainerRef
   * @param mode
   */
  public dialogChangeMachinesGroup(viewContainerRef: ViewContainerRef,mode:number = 0): Observable<TypeMachine> {
    let dialogRef: MatDialogRef<ChangeTypeMachineDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = mode;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(ChangeTypeMachineDialogComponent, config);
    return dialogRef.afterClosed();
  }

  /**
 * Change machine group for jobcarddetail
 * @param viewContainerRef
 * @param mode
 */
  public dialogChangeActualManHour(taskMachine: TaskMachine,viewContainerRef: ViewContainerRef): Observable<TaskMachine> {
    let dialogRef: MatDialogRef<ManhourTaskMachineDialogComponent>;
    let config: MatDialogConfig = new MatDialogConfig();

    // config
    config.viewContainerRef = viewContainerRef;
    config.data = taskMachine;
    config.hasBackdrop = true;

    // open dialog
    dialogRef = this.dialog.open(ManhourTaskMachineDialogComponent, config);
    return dialogRef.afterClosed();
  }
}
