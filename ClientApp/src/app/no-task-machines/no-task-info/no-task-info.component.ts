import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { BaseInfoComponent } from '../../shared/base-info-component';
import { NoTaskMachine } from '../shared/no-task-machine.model';
import { NoTaskMachineService } from '../shared/no-task-machine.service';
import { NoTaskMachineCommunicateService } from '../shared/no-task-machine-communicate.service';
import { JobcardDetailService } from '../../jobcard-masters/shared/jobcard-detail.service';
import { JobcardMaster } from '../../jobcard-masters/shared/jobcard-master.model';
import { AuthService } from '../../core/auth/auth.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DialogsService } from '../../dialogs/shared/dialogs.service';

@Component({
  selector: 'app-no-task-info',
  templateUrl: './no-task-info.component.html',
  styleUrls: ['./no-task-info.component.scss']
})
export class NoTaskInfoComponent extends
  BaseInfoComponent<NoTaskMachine, NoTaskMachineService, NoTaskMachineCommunicateService> {
  constructor(
    service: NoTaskMachineService,
    serviceCom: NoTaskMachineCommunicateService,
    private serviceDialog: DialogsService,
    private serviceJobDetail: JobcardDetailService,
    private serviceAuth: AuthService,
    private fb: FormBuilder,
    private viewContainer: ViewContainerRef,
  ) {
    super(service, serviceCom);
  }
  // Parameter
  jobMaster: JobcardMaster;
  // on get data
  onGetDataByKey(InfoValue: NoTaskMachine): void {
    if (InfoValue && InfoValue.JobCardDetailId) {
      if (InfoValue.NoTaskMachineId) {
        this.service.getOneKeyNumber(InfoValue)
          .subscribe(dbData => {
            this.InfoValue = dbData;
            this.OnGetJobCardDetail();
          }, error => console.error(error), () => this.buildForm());
      } else {
        this.InfoValue = {
          NoTaskMachineId: 0,
          JobCardDetailId: InfoValue.JobCardDetailId,
          Date: new Date()
        };

        if (this.serviceAuth.getAuth) {
          this.InfoValue.AssignedBy = this.serviceAuth.getAuth.EmpCode;
          this.InfoValue.AssignedByString = this.serviceAuth.getAuth.NameThai;
        }
        this.buildForm();
        this.OnGetJobCardDetail();
      }
    } else {
      this.InfoValue = { NoTaskMachineId: 0 };
      this.buildForm();
    }
  }
  //BulidForm
  buildForm(): void {
    this.InfoValueForm = this.fb.group({
      NoTaskMachineId: [this.InfoValue.NoTaskMachineId],
      NoTaskMachineCode: [this.InfoValue.NoTaskMachineCode],
      Description: new FormControl(
        { value: this.InfoValue.Description, disabled: this.denySave },
        Validators.maxLength(200)
      ),
      Remark: new FormControl(
        { value: this.InfoValue.Remark, disabled: this.denySave },
        Validators.maxLength(200)
      ),
      Quantity: new FormControl(
        { value: this.InfoValue.Quantity, disabled: this.denySave },
        Validators.min(0)
      ),
      Date: new FormControl(
        {
          value: this.InfoValue.Date,
          disabled: this.denySave,
        },
        Validators.required
      ),
      JobCardDetailId: [this.InfoValue.JobCardDetailId],
      AssignedBy: [this.InfoValue.AssignedBy],
      GroupCode: [this.InfoValue.GroupCode],
      GroupMis: [this.InfoValue.GroupMis],
      // BaseModel
      Creator: [this.InfoValue.Creator],
      CreateDate: [this.InfoValue.CreateDate],
      Modifyer: [this.InfoValue.Modifyer],
      ModifyDate: [this.InfoValue.ModifyDate],
      // ViewModel
      AssignedByString: new FormControl({ value: this.InfoValue.AssignedByString, disabled: this.denySave }, Validators.required),
      GroupCodeString: new FormControl({ value: this.InfoValue.GroupCodeString, disabled: this.denySave }),
      CuttingPlanNo: new FormControl({ value: this.InfoValue.CuttingPlanNo, disabled: this.denySave }),
      GroupMisString: new FormControl({ value: this.InfoValue.GroupMisString, disabled: this.denySave }, Validators.required),
    });
    this.InfoValueForm.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe(data => this.onValueChanged(data));
  }

  // On Get jobcardDetail
  OnGetJobCardDetail(): void {
    this.serviceJobDetail.getJobcardMasterByDetail(this.InfoValue.JobCardDetailId)
      .subscribe(dbJobMaster => {
        this.jobMaster = Object.assign({}, dbJobMaster);
        if (this.InfoValue.JobCardDetailId && this.jobMaster.JobCardDetails && this.jobMaster.JobCardDetails[0]) {
          this.InfoValueForm.patchValue({
            Quantity: this.jobMaster.JobCardDetails[0].Quality
          });
        }
      });
  }

  // Open Dialog
  openDialog(type?: string): void {
    if (this.denySave) {
      return;
    }
    if (type) {
      if (type.indexOf("Employee") !== -1) {
        this.serviceDialog.dialogSelectEmployee(this.viewContainer)
          .subscribe(emp => {
            this.InfoValueForm.patchValue({
              AssignedBy: emp ? emp.EmpCode : undefined,
              AssignedByString: emp ? `คุณ${emp.NameThai}` : undefined,
            });
          });
      } else if (type.indexOf("GroupMis") !== -1) {
        this.serviceDialog.dialogSelectGroupMis(this.viewContainer)
          .subscribe(groupMis => {
            this.InfoValueForm.patchValue({
              GroupMis: groupMis ? groupMis.GroupMIS : undefined,
              GroupMisString: groupMis ? groupMis.GroupDesc : undefined
            });
          });
      } else if (type.indexOf("JobCard") !== -1) {
        if (this.jobMaster && this.jobMaster.JobCardDetails[0]) {
          this.serviceDialog.dialogSelectRequireMachine(this.jobMaster.JobCardDetails[0], this.viewContainer, false)
            .subscribe();
        }
      }
    }
  }
}
