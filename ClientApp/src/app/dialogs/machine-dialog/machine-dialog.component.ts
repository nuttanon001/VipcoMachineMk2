import { Component, OnInit, Inject } from '@angular/core';
import { BaseDialogComponent } from '../../shared/base-dialog.component';
import { Machine } from '../../machines/shared/machine.model';
import { MachineService } from '../../machines/shared/machine.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TypeMachineService } from '../../machines/shared/type-machine.service';

@Component({
  selector: 'app-machine-dialog',
  templateUrl: './machine-dialog.component.html',
  styleUrls: ['./machine-dialog.component.scss'],
  providers: [MachineService,TypeMachineService]
})
export class MachineDialogComponent extends BaseDialogComponent<Machine, MachineService> {
  /** employee-dialog ctor */
  constructor(
    public service: MachineService,
    public dialogRef: MatDialogRef<MachineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: number, TypeMachineId:number }
  ) {
    super(
      service,
      dialogRef
    );
  }
  // on init
  onInit(): void {
    this.fastSelectd = this.data.mode === 0 ? true : false;
  }
}
