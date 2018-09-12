import { Component, OnInit, Inject } from '@angular/core';
import { BaseDialogComponent } from '../../shared/base-dialog.component';
import { TypeMachine } from '../../machines/shared/type-machine.model';
import { TypeMachineService } from '../../machines/shared/type-machine.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-change-type-machine-dialog',
  templateUrl: './change-type-machine-dialog.component.html',
  styleUrls: ['./change-type-machine-dialog.component.scss'],
  providers: [TypeMachineService]
})
export class ChangeTypeMachineDialogComponent extends BaseDialogComponent<TypeMachine,TypeMachineService> {

  constructor(
    public service: TypeMachineService,
    public dialogRef: MatDialogRef<ChangeTypeMachineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public mode: number
  ) {
    super(
      service,
      dialogRef
    );
  }
  // Parameter
  typeMachines: Array<TypeMachine>;

  // on init
  onInit(): void {
    this.fastSelectd = this.mode === 0 ? true : false;
    if (!this.typeMachines) {
      this.service.getAll().subscribe((data: Array<TypeMachine>) => this.typeMachines = data.slice());
    }
  }

  // No Click
  onCancelClick(): void {
    this.dialogRef.close();
  }

  // Update Click
  onSelectedClick(): void {
    if (this.getValue) {
      this.dialogRef.close(this.getValue); 
    } else if (this.getValues) {
      this.dialogRef.close(this.getValues);
    }
  }
}
