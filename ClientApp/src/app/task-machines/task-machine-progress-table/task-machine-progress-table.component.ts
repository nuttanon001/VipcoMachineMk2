import { Component, OnInit } from '@angular/core';
import { ProgressTaskMachine } from '../shared/progress-task-machine.model';
import { BaseTableFontData } from '../../shared/base-table-fontdata.component';

@Component({
  selector: 'app-task-machine-progress-table',
  templateUrl: './task-machine-progress-table.component.html',
  styleUrls: ['./task-machine-progress-table.component.scss']
})
export class TaskMachineProgressTableComponent extends BaseTableFontData<ProgressTaskMachine> {
  constructor() {
    super();
    this.displayedColumns = ["ProgressDate", "Quantity","Weight","ProgressTaskMachineStatusString", "Command"];
  }
}
