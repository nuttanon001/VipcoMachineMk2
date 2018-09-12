import { Component, OnInit, Inject } from '@angular/core';
import { TypeStandardTime } from '../../standard-times/shared/type-standard-time.model';
import { TypeStandardTimeService } from '../../standard-times/shared/type-standard-time.service';
import { TypeMachineService } from '../../machines/shared/type-machine.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BaseDialogEntryComponent } from '../../shared/base-dialog-entry.component';

@Component({
  selector: 'app-type-standardtime-dialog',
  templateUrl: './type-standardtime-dialog.component.html',
  styleUrls: ['./type-standardtime-dialog.component.scss'],
  providers: [
    TypeStandardTimeService,
    TypeMachineService,
  ]
})
export class TypeStandardtimeDialogComponent extends BaseDialogEntryComponent<TypeStandardTime, TypeStandardTimeService> {
  /** employee-dialog ctor */
  constructor(
    public service: TypeStandardTimeService,
    public dialogRef: MatDialogRef<TypeStandardtimeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public mode: number
  ) {
    super(
      service,
      dialogRef
    );
  }

  // on init
  onInit(): void {
    this.fastSelectd = this.mode === 0 ? true : false;
  }

  // on new entity
  onNewEntity(): void {
    this.InfoValue = {
      TypeStandardTimeId: 0
    };
  }
}
