import { Component, OnInit, Input } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BaseInfoDialogComponent } from '../../../shared/base-info-dialog-component';
import { ProgressTaskMachine } from '../../../task-machines/shared/progress-task-machine.model';
import { FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-progress-task-machine-info',
  templateUrl: './progress-task-machine-info.component.html',
  styleUrls: ['./progress-task-machine-info.component.scss']
})
export class ProgressTaskMachineInfoComponent extends BaseInfoDialogComponent<ProgressTaskMachine> {

  constructor(
    private fb: FormBuilder,
  ) { super() }
  // Parameters
  @Input() denyEdit: boolean = false;
  maxQuantity: number;
  // Methods
  buildForm(): void {
    //debug
    this.maxQuantity = this.InfoValue.MaxQuantity;
    // Create Form Array
    this.InfoValueForm = this.fb.group({
      ProgressId: [this.InfoValue.ProgressId],
      Quantity: new FormControl({ value: this.InfoValue.Quantity, disabled: this.denyEdit },
        [
          Validators.min(0),
          Validators.max(this.maxQuantity),
          Validators.required
        ]),// [this.InfoValue.Quantity,[Validators.min(0),]],
      Weight: new FormControl({ value: this.InfoValue.Weight, disabled: this.denyEdit },Validators.min(0)), // [this.InfoValue.Weight, [Validators.min(0)]],
      ProgressDate: new FormControl({ value: this.InfoValue.ProgressDate, disabled: true }), //[this.InfoValue.ProgressDate],
      ProgressTaskMachineStatus: [this.InfoValue.ProgressTaskMachineStatus],
      TaskMachineId: [this.InfoValue.TaskMachineId],
      // BaseModel
      Creator: [this.InfoValue.Creator],
      CreateDate: [this.InfoValue.CreateDate],
      Modifyer: [this.InfoValue.Modifyer],
      ModifyDate: [this.InfoValue.ModifyDate],
      ReadOnly: [this.InfoValue.ReadOnly],
      // ViewModel
      ProgressDateTime: new FormControl({ value: this.InfoValue.ProgressDateTime, disabled: true }) //[this.InfoValue.ProgressDateTime]
    });

    const ControlMoreActivities: AbstractControl | undefined = this.InfoValueForm.get("Quantity");
    if (ControlMoreActivities) {
      ControlMoreActivities.valueChanges.pipe(
        debounceTime(150),
        distinctUntilChanged()).subscribe((data: any) => {
          if (data) {
            if (data > this.maxQuantity) {
              this.InfoValueForm.patchValue({
                Quantity: this.maxQuantity
              });
            }
          }});
    }
    // On Form Value
    this.InfoValueForm.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe(data => {
      if (!this.InfoValueForm) { return; }
      if (this.InfoValueForm.valid) {
        this.InfoValue = this.InfoValueForm.getRawValue() as ProgressTaskMachine;
        this.SubmitOrCancel.emit({ data: this.InfoValue, force: false });
      }
    });
  }
}
