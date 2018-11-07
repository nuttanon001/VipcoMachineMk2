import { Component, OnInit } from '@angular/core';
import { BaseTableMk2Component } from '../../shared/base-table-mk2.component';
import { CuttingPlan } from '../shared/cutting-plan.model';
import { CuttingPlanService } from '../shared/cutting-plan.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-cutting-plan-nouse-table',
  templateUrl: './cutting-plan-nouse-table.component.html',
  styleUrls: ['./cutting-plan-nouse-table.component.scss']
})
export class CuttingPlanNouseTableComponent extends BaseTableMk2Component<CuttingPlan, CuttingPlanService>{

  constructor(service: CuttingPlanService, serviceAuth: AuthService) {
    super(service, serviceAuth);
    this.columns = [
      { columnName: "", columnField: "select", cell: undefined },
      { columnName: "Cuttingplan.", columnField: "CuttingPlanNo", cell: (row: CuttingPlan) => row.CuttingPlanNo },
      { columnName: "BomLv2/3", columnField: "ProjectCodeString", cell: (row: CuttingPlan) => row.ProjectCodeString },
      { columnName: "AssignedBy", columnField: "CreateNameThai", cell: (row: CuttingPlan) => row.CreateNameThai },
    ];

    this.displayedColumns = this.columns.map(x => x.columnField);
    this.displayedColumns.splice(0, 0, "Command");

    this.isDisabled = false;
    this.isSubAction = "GetScrollNotUser/";
  }

}
