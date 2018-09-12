import { Location } from "@angular/common";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
// Components
import { BaseMasterComponent } from '../../shared/base-master-component';
import { NoTaskTableComponent } from '../no-task-table/no-task-table.component';
// Models
import { NoTaskMachine } from '../shared/no-task-machine.model';
// Services
import { AuthService } from '../../core/auth/auth.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { NoTaskMachineService } from '../shared/no-task-machine.service';
import { NoTaskMachineCommunicateService } from '../shared/no-task-machine-communicate.service';

@Component({
  selector: 'app-no-task-master',
  templateUrl: './no-task-master.component.html',
  styleUrls: ['./no-task-master.component.scss']
})
export class NoTaskMasterComponent extends BaseMasterComponent<NoTaskMachine,NoTaskMachineService,NoTaskMachineCommunicateService> {

  constructor(
    service: NoTaskMachineService,
    serviceCom: NoTaskMachineCommunicateService,
    serviceDialog: DialogsService,
    serviceAuth: AuthService,
    viewCon: ViewContainerRef,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    super(service, serviceCom, serviceAuth, serviceDialog, viewCon);
  }
  backToSchedule: boolean = false;
  @ViewChild(NoTaskTableComponent)
  private tableComponent: NoTaskTableComponent;

  ngOnInit(): void {
    super.ngOnInit();
    this.route.paramMap.subscribe((param: ParamMap) => {
      let key: number = Number(param.get("key") || 0);
      if (key) {
        let value: { data: NoTaskMachine, option: number } = {
          data: {
            NoTaskMachineId: 0,
            JobCardDetailId: key
          },
          option: 1
        }
        this.backToSchedule = true;
        this.onDetailView(value);
      }
    }, error => console.error(error));
  }

  onReloadData(): void {
    this.tableComponent.reloadData();
  }

  // on cancel edit
  onCancelEdit(): void {
    this.displayValue = undefined;
    this.ShowDetail = false;
    this.canSave = false;
    this.onBack();
  }

  onCheckStatus(infoValue?: NoTaskMachine): boolean {
    if (this.authService.getAuth) {
      if (this.authService.getAuth.LevelUser < 3) {
        if (this.authService.getAuth.UserName !== infoValue.Creator) {
          this.dialogsService.error("Access Denied", "You don't have permission to access.", this.viewContainerRef);
          return false;
        }

        let toDay = new Date;

        if (infoValue.CreateDate !== toDay ) {
          this.dialogsService.error("Access Deny", "คำขอตรวจสอบคุณภาพ ได้รับการดำเนินการไม่สามารถแก้ไขได้ !!!", this.viewContainerRef);
          return false;
        }
      }
    }

    return true;
  }

  // on back from report
  onBack(): void {
    if (this.backToSchedule) {
      this.location.back();
    }
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
}
