import { Component, OnInit, Inject } from '@angular/core';
import { BaseDialogComponent } from '../../shared/base-dialog.component';
import { TaskMachine } from '../../task-machines/shared/task-machine.model';
import { TaskMachineService } from '../../task-machines/shared/task-machine.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-manhour-task-machine-dialog',
  templateUrl: './manhour-task-machine-dialog.component.html',
  styleUrls: ['./manhour-task-machine-dialog.component.scss'],
  providers: [TaskMachineService]
})
export class ManhourTaskMachineDialogComponent extends BaseDialogComponent<TaskMachine,TaskMachineService> {

  constructor(
    public service: TaskMachineService,
    public dialogRef: MatDialogRef<ManhourTaskMachineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public InfoValue?: TaskMachine
  ) {
    super(service, dialogRef);
  }

  // on init
  onInit(): void {
    this.fastSelectd = this.InfoValue.TaskMachineId === -99;
  }

  // on complate or cancel entity
  onComplateOrCancelEntity(infoValue?: { data: TaskMachine | undefined, force: boolean }): void {
    if (infoValue) {
      if (infoValue.data) {
        this.getValue = infoValue.data;
        if (infoValue.force) {
          this.onSelectedClick();
        }
      } else {
        this.getValue = undefined;
      }
    }
  }
}
