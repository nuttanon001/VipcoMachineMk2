import { Component, OnInit, Inject } from '@angular/core';
import { BaseDialogViewComponent } from '../../shared/base-dialog-view.component';
import { JobcardMaster } from '../../jobcard-masters/shared/jobcard-master.model';
import { JobcardMasterService } from '../../jobcard-masters/shared/jobcard-master.service';
import { JobcardMasterCommuncateService } from '../../jobcard-masters/shared/jobcard-master-communcate.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EmployeeGroupService } from '../../employees/shared/employee-group.service';
import { JobcardDetailService } from '../../jobcard-masters/shared/jobcard-detail.service';
import { TypeMachineService } from '../../machines/shared/type-machine.service';
import { JobcardDetail } from '../../jobcard-masters/shared/jobcard-detail.model';

@Component({
  selector: 'app-jobcard-master-dialog',
  templateUrl: './jobcard-master-dialog.component.html',
  styleUrls: ['./jobcard-master-dialog.component.scss'],
  providers: [
    JobcardMasterService,
    JobcardMasterCommuncateService,
    EmployeeGroupService,
    JobcardDetailService,
    TypeMachineService,
  ]
})
export class JobcardMasterDialogLmSmComponent extends BaseDialogViewComponent<JobcardMaster,JobcardMasterCommuncateService> {

  constructor(
    serviceCommunicate: JobcardMasterCommuncateService,
    public dialogRef: MatDialogRef<JobcardMasterDialogLmSmComponent>,
    @Inject(MAT_DIALOG_DATA) public optionData?: { infoValue: JobcardMaster, ShowCommand: boolean }
  ) {
    super(serviceCommunicate, dialogRef);
  }
  jobCardDetailId: number;
  isLmSm: boolean = true;
  jobCardDetail: JobcardDetail;

  onInit(): void {
    if (this.optionData) {
      this.optionData.infoValue.ReadOnly = true;

      let jobCardMaster: JobcardMaster = {
        JobCardMasterId: this.optionData.infoValue.JobCardMasterId,
        ReadOnly :true
      };
      this.onDetailView(jobCardMaster);
    } else {
      this.onCancelClick();
    }
  }

  onSelectedClick(option?: number): void {
    if (option) {
      if (option === -1) {
        this.jobCardDetail = { JobCardDetailId: -1 };
      } else if (option === 2) {
        this.jobCardDetail.StatusString = "Split";
      }
      this.dialogRef.close(this.jobCardDetail);
    }
  }

  onSelected(value?: JobcardDetail): void {
    if (value) {
      if (value.JobCardDetailId > 0) {
        this.jobCardDetail = value;
      } else {
        this.dialogRef.close(value);
      }
    }
  }
}
