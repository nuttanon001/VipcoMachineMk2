// Angular Core
import { Location } from "@angular/common";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
// Components
import { BaseMasterComponent } from '../../shared/base-master-component';
import { TaskMachineTableComponent } from '../task-machine-table/task-machine-table.component';
// Models
import { TaskMachine } from '../shared/task-machine.model';
import { TaskMachineStatus } from '../shared/task-machine-status.enum';
// Services
import { AuthService } from '../../core/auth/auth.service';
import { TaskMachineService } from '../shared/task-machine.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { TaskMachineCommunicateService } from '../shared/task-machine-communicate.service';

@Component({
  selector: 'app-task-machine-master',
  templateUrl: './task-machine-master.component.html',
  styleUrls: ['./task-machine-master.component.scss']
})
export class TaskMachineMasterComponent
  extends BaseMasterComponent<TaskMachine, TaskMachineService, TaskMachineCommunicateService> {

  constructor(
    service: TaskMachineService,
    serviceCommunicate: TaskMachineCommunicateService,
    serviceDialos: DialogsService,
    serviceAuth: AuthService,
    viewContainerRef: ViewContainerRef,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    super(service, serviceCommunicate, serviceAuth, serviceDialos, viewContainerRef);
  }

  // Parameter
  backToSchedule: boolean = false;
  loadReport: boolean = false;
  @ViewChild(TaskMachineTableComponent)
  private tableComponent: TaskMachineTableComponent;

  // on reload data
  onReloadData(): void {
    this.tableComponent.reloadData();
  }
  // on check status
  onCheckStatus(infoValue?: TaskMachine): boolean {
    if (this.authService.getAuth) {
      if (this.authService.getAuth.LevelUser < 3) {
        //if (this.authService.getAuth.UserName !== infoValue.Creator) {
        //  this.dialogsService.error("Access Denied", "You don't have permission to access.", this.viewContainerRef);
        //  return false;
        //}
        if (infoValue.TaskMachineId) {
          if (infoValue.TaskMachineStatus != TaskMachineStatus.Wait && infoValue.TaskMachineStatus != TaskMachineStatus.Process) {
            this.dialogsService.error("Access Deny", "This task can't edit !!!", this.viewContainerRef);
            return false;
          }
        }
      }
    }

    return true;
  }
  //////////////
  // Override //
  //////////////
  //on ngInitAngular
  ngOnInit(): void {
    super.ngOnInit();
    this.route.paramMap.subscribe((param: ParamMap) => {
      let taskid: number = Number(param.get("taskid") || 0);
      let jobid: number = Number(param.get("jobid") || 0);

      if (taskid && jobid) {
        let value: { data: TaskMachine, option: number } = {
          data: {
            TaskMachineId: taskid,
            JobCardDetailId: jobid,
            TaskMachineStatus: TaskMachineStatus.Process,
            IsProgress: true,
          },
          option: 1
        }
        this.backToSchedule = true;
        this.onDetailView(value);
      }
    }, error => console.error(error));

    this.route.paramMap.subscribe((param: ParamMap) => {
      let key: number = Number(param.get("key") || 0);
      if (key) {
        let value: { data: TaskMachine, option: number } = {
          data: {
            TaskMachineId: 0,
            JobCardDetailId: key,
            TaskMachineStatus: TaskMachineStatus.Wait,
          },
          option: 1
        }
        this.backToSchedule = true;
        this.onDetailView(value);
      }
    }, error => console.error(error));

    this.route.paramMap.subscribe((param: ParamMap) => {
      let key: number = Number(param.get("report") || 0);
      if (key) {
        this.displayValue = { TaskMachineId: key };
        this.loadReport = true;
        this.backToSchedule = true;
      }
    }, error => console.error(error));
  }

  // on save complete
  onSaveComplete(): void {
    this.dialogsService.context("System message", "Save completed.", this.viewContainerRef)
      .subscribe(result => {
        this.ShowDetail = false;
        this.displayValue = undefined;
        this.onBack();
      });
  }

  // on back from report
  onBack(): void {
    if (this.displayValue) {
      this.loadReport = !this.loadReport;
    }
    if (this.backToSchedule) {
      this.location.back();
    }
  }

  // on cancel edit
  onCancelEdit(): void {
    this.displayValue = undefined;
    this.ShowDetail = false;
    this.canSave = false;
    this.onBack();
  }

  // on display value
  onDisplayValue(value?:TaskMachine): void {
    this.displayValue = value;
  }

  // on show report
  onReport(Value?: TaskMachine): void {
    if (Value) {
      this.service.getTaskMachinePaper(Value.TaskMachineId)
        .subscribe();
    }
  }

  // on insert data
  onInsertToDataBase(value: TaskMachine): void {
    if (this.authService.getAuth) {
      value["Creator"] = this.authService.getAuth.UserName || "";
    }
    // insert data
    this.service.addModel(value).subscribe(
      (complete: TaskMachine) => {
        if (complete) {
          this.displayValue = complete;
          if (this.displayValue.TaskMachineStatus === TaskMachineStatus.Complate) {
            const actualMan = complete.ActualManHours;
            this.dialogsService.dialogChangeActualManHour(complete, this.viewContainerRef)
              .subscribe(result => {
                if (result) {
                  if (result.ActualManHours !== actualMan) {
                    this.service.updateModelWithKey(result).subscribe(result => {
                      this.onSaveComplete();
                    });
                  }
                }
                this.onSaveComplete();
              });
          } else {
            this.onSaveComplete();
          }
        }
        if (this.onLoading) {
          this.onLoading = false;
        }
      },
      (error: any) => {
        console.error(error);
        this.dialogsService.error("Failed !",
          "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
      }
    );
  }

  // on update data
  onUpdateToDataBase(value: TaskMachine): void {
    if (this.authService.getAuth) {
      value["Modifyer"] = this.authService.getAuth.UserName || "";
    }
    // update data
    this.service.updateModelWithKey(value).subscribe(
      (complete: TaskMachine) => {
        if (complete) {
          this.displayValue = complete;
          if (this.displayValue.TaskMachineStatus === TaskMachineStatus.Complate) {

            // debug here
            // console.log(JSON.stringify(complete));

            const actualMan = complete.ActualManHours;
            this.dialogsService.dialogChangeActualManHour(complete, this.viewContainerRef)
              .subscribe(result => {
                if (result) {
                  if (result.ActualManHours !== actualMan) {
                    this.service.updateModelWithKey(result).subscribe(result => {
                      this.onSaveComplete();
                    });
                  }
                }
                this.onSaveComplete();
              });
          } else {
            this.onSaveComplete();
          }
        }
        if (this.onLoading) {
          this.onLoading = false;
        }
      },
      (error: any) => {
        console.error(error);
        this.dialogsService.error("Failed !",
          "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
      }
    );
  }
}
