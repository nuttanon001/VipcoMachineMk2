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
export class JobcardMasterDialogComponent extends BaseDialogViewComponent<JobcardMaster,JobcardMasterCommuncateService> {

  constructor(
    serviceCommunicate: JobcardMasterCommuncateService,
    public dialogRef: MatDialogRef<JobcardMasterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public optionData?: { infoValue: JobcardDetail, ShowCommand: boolean }
  ) {
    super(serviceCommunicate, dialogRef);
  }
  jobCardDetailId: number;
  isLmSm: boolean = false;
  onInit(): void {
    if (this.optionData) {
      this.optionData.infoValue.ReadOnly = true;
      this.jobCardDetailId = this.optionData.infoValue.JobCardDetailId;

      let jobCardMaster: JobcardMaster = {
        JobCardMasterId: this.optionData.infoValue.JobCardMasterId,
        ReadOnly :true
      };
      this.onDetailView(jobCardMaster);
    } else {
      this.onCancelClick();
    }
  }

  onSelectedClick(option?:number): void {
    this.dialogRef.close(option);
  }

  onSelected(data?:any): void {
  }
}
