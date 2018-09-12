import { Component, OnInit } from '@angular/core';
import { BaseTableComponent } from '../../shared/base-table.component';
import { TaskMachine } from '../shared/task-machine.model';
import { TaskMachineService } from '../shared/task-machine.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-task-machine-table',
  templateUrl: './task-machine-table.component.html',
  styleUrls: ['./task-machine-table.component.scss']
})
export class TaskMachineTableComponent extends BaseTableComponent<TaskMachine, TaskMachineService> {

  constructor(service: TaskMachineService, serviceAuth: AuthService) {
    super(service, serviceAuth);
    this.displayedColumns = ["select","Command", "TaskMachineName", "TaskMachineStatusString", "AssignedByString", "CuttingPlanNo", "StandardTimeString", "MachineString", "PlannedStartDate"];
    this.isDisabled = false;
  }
}
