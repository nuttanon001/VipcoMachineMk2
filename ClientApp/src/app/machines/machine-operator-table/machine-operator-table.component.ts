import { Component, OnInit } from '@angular/core';
import { BaseTableFontData } from '../../shared/base-table-fontdata.component';
import { MachineOperator } from '../shared/machine-operator.model';

@Component({
  selector: 'app-machine-operator-table',
  templateUrl: './machine-operator-table.component.html',
  styleUrls: ['./machine-operator-table.component.scss']
})
export class MachineOperatorTableComponent extends BaseTableFontData<MachineOperator> {
  constructor() {
    super();
    this.displayedColumns = ["EmpCode", "EmployeeString", "Command"];
  }
}
