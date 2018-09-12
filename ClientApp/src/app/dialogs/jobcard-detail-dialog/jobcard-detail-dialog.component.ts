import { Component, OnInit, Inject } from '@angular/core';
import { JobcardDetailService } from '../../jobcard-masters/shared/jobcard-detail.service';
import { BaseDialogComponent } from '../../shared/base-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { JobcardDetail } from '../../jobcard-masters/shared/jobcard-detail.model';
import { DialogsService } from '../shared/dialogs.service';

@Component({
  selector: 'app-jobcard-detail-dialog',
  templateUrl: './jobcard-detail-dialog.component.html',
  styleUrls: ['./jobcard-detail-dialog.component.scss'],
  providers: [
    JobcardDetailService,
  ]
})
export class JobcardDetailDialogComponent extends BaseDialogComponent<JobcardDetail, JobcardDetailService> {

  constructor(
    public service: JobcardDetailService,
    public dialogRef: MatDialogRef<JobcardDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public InfoValue?: { data: JobcardDetail,option:boolean}
  ) {
    super(service, dialogRef);
  }

  // on init
  onInit(): void {
    // console.log(JSON.stringify(this.InfoValue));

    if (this.InfoValue.data && this.InfoValue.data.JobCardDetailId) {
      this.fastSelectd = this.InfoValue.data.JobCardDetailId === -99;
    }
  }

  // on complate or cancel entity
  onComplateOrCancelEntity(infoValue?: { data: JobcardDetail | undefined, force: boolean }): void {
    if (infoValue) {
      if (infoValue.data) {
        this.getValue = infoValue.data;
        if (infoValue.force) {
          this.onSelectedClick();
        }
      }
    }
  }
}
