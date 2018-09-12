import { Component, Input } from '@angular/core';
import { BaseInfoDialogComponent } from '../../../shared/base-info-dialog-component';
import { TaskMachine } from '../../../task-machines/shared/task-machine.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-manhour-change',
  templateUrl: './manhour-change.component.html',
  styleUrls: ['./manhour-change.component.scss']
})
export class ManhourChangeComponent extends BaseInfoDialogComponent<TaskMachine> {
  constructor(
    private fb: FormBuilder,
  ) { super() }
  // Parameters
  @Input() denyEdit: boolean = false;

  // Methods
  buildForm(): void {
    // Create Form Array
    this.InfoValueForm = this.fb.group({
      TaskMachineId: [this.InfoValue.TaskMachineId],
      TaskMachineName: [this.InfoValue.TaskMachineName],
      Description: new FormControl(
        { value: this.InfoValue.Description, disabled: this.denySave },
        [Validators.maxLength(200)]
      ),
      TaskMachineStatus: [this.InfoValue.TaskMachineStatus],
      Priority: [this.InfoValue.Priority],
      TotalQuantity: new FormControl(
        { value: this.InfoValue.TotalQuantity, disabled: this.denySave },
        [Validators.min(0)]
      ),
      CurrentQuantity: new FormControl(
        { value: this.InfoValue.CurrentQuantity, disabled: this.denySave }
      ),
      Weight: new FormControl(
        {
          value: this.InfoValue.Weight,
          disabled: this.denySave,
        },
        [Validators.min(0), Validators.required],
      ),
      PlannedStartDate: new FormControl(
        {
          value: this.InfoValue.PlannedStartDate,
          disabled: this.denySave,
        },
        [Validators.required]
      ),
      PlannedEndDate: new FormControl(
        { value: this.InfoValue.PlannedEndDate, disabled: true },
        [Validators.required]
      ),
      ActualStartDate: new FormControl(
        { value: this.InfoValue.ActualStartDate, disabled: true }
      ),
      ActualEndDate: new FormControl(
        { value: this.InfoValue.ActualEndDate, disabled: true }
      ),
      TaskDueDate: new FormControl(
        { value: this.InfoValue.TaskDueDate, disabled: this.denySave },
        [Validators.required]
      ),
      HasOverTime: new FormControl(
        { value: this.InfoValue.HasOverTime, disabled: this.denySave },
      ),
      ActualManHours: new FormControl(
        { value: this.InfoValue.ActualManHours, disabled: false },
        [ Validators.required , Validators.min(0) ]
      ),
      PlanManHours: [this.InfoValue.PlanManHours],
      MachineId: [this.InfoValue.MachineId],
      JobCardDetailId: [this.InfoValue.JobCardDetailId],
      StandardTimeId: [this.InfoValue.StandardTimeId],
      AssignedBy: [this.InfoValue.AssignedBy],
      PrecedingTaskMachineId: [this.InfoValue.PrecedingTaskMachineId],
      ProgressTaskMachines: [this.InfoValue.ProgressTaskMachines],
      // BaseModel
      Creator: [this.InfoValue.Creator],
      CreateDate: [this.InfoValue.CreateDate],
      Modifyer: [this.InfoValue.Modifyer],
      ModifyDate: [this.InfoValue.ModifyDate],
    });

    // On Form Value
    this.InfoValueForm.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe(data => {
      this.updateValueChange(data);
    });

    this.updateValueChange();
  }

  updateValueChange(data?: any) {
    if (!this.InfoValueForm) { return; }
    if (this.InfoValueForm.valid) {
      this.InfoValue = this.InfoValueForm.getRawValue() as TaskMachine;
      this.SubmitOrCancel.emit({ data: this.InfoValue, force: false });
    } else {
      this.SubmitOrCancel.emit({ data: undefined, force: false });
    }
  }
}
