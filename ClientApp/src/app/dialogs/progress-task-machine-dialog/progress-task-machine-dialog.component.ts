import { Component, OnInit, Inject } from '@angular/core';
import { BaseDialogComponent } from '../../shared/base-dialog.component';
import { ProgressTaskMachine } from '../../task-machines/shared/progress-task-machine.model';
import { ProgressTaskMachineService } from '../../task-machines/shared/progress-task-machine.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-progress-task-machine-dialog',
  templateUrl: './progress-task-machine-dialog.component.html',
  styleUrls: ['./progress-task-machine-dialog.component.scss'],
  providers: [ProgressTaskMachineService]
})
export class ProgressTaskMachineDialogComponent extends BaseDialogComponent<ProgressTaskMachine, ProgressTaskMachineService> {

  constructor(
    public service: ProgressTaskMachineService,
    public dialogRef: MatDialogRef<ProgressTaskMachineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public InfoValue?: ProgressTaskMachine
  ) {
    super(service, dialogRef);
  }

  // on init
  onInit(): void {
    this.fastSelectd = this.InfoValue.ProgressId === -99;
  }

  // on complate or cancel entity
  onComplateOrCancelEntity(infoValue?: { data: ProgressTaskMachine | undefined, force: boolean }): void {
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
