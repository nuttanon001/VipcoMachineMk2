import { Component, OnInit } from '@angular/core';
import { BaseTableMk2Component } from '../../shared/base-table-mk2.component';
import { NoTaskMachine } from '../shared/no-task-machine.model';
import { NoTaskMachineService } from '../shared/no-task-machine.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-no-task-table',
  templateUrl: './no-task-table.component.html',
  styleUrls: ['./no-task-table.component.scss']
})
export class NoTaskTableComponent extends BaseTableMk2Component<NoTaskMachine,NoTaskMachineService>{

  constructor(service: NoTaskMachineService, serviceAuth: AuthService) {
    super(service,serviceAuth);
    this.columns = [
      { columnName: "", columnField: "select", cell: undefined },
      //{ columnName: "", columnField: "Command", cell: undefined },
      { columnName: "No.", columnField: "NoTaskMachineCode", cell: (row: NoTaskMachine) => row.NoTaskMachineCode },
      { columnName: "Cuttingplan", columnField: "CuttingPlanNo", cell: (row: NoTaskMachine) => row.CuttingPlanNo },
      { columnName: "AssignedBy", columnField: "AssignedByString", cell: (row: NoTaskMachine) => row.AssignedByString },
      { columnName: "WorkGroup", columnField: "GroupMisString", cell: (row: NoTaskMachine) => row.GroupMisString },
      { columnName: "Date", columnField: "Date", cell: (row: NoTaskMachine) => row.Date },
    ];

    this.displayedColumns = this.columns.map(x => x.columnField);
    this.displayedColumns.splice(0, 0, "Command");

    this.isDisabled = false;
  }

}
