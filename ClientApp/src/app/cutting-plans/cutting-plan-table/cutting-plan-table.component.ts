import { Component, OnInit } from '@angular/core';
import { BaseTableComponent } from '../../shared/base-table.component';
import { CuttingPlan } from '../shared/cutting-plan.model';
import { CuttingPlanService } from '../shared/cutting-plan.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-cutting-plan-table',
  templateUrl: './cutting-plan-table.component.html',
  styleUrls: ['./cutting-plan-table.component.scss']
})
export class CuttingPlanTableComponent extends BaseTableComponent<CuttingPlan, CuttingPlanService> {

  constructor(service: CuttingPlanService, serviceAuth: AuthService) {
    super(service, serviceAuth);
    this.displayedColumns = ["select", "CuttingPlanNo", "ProjectCodeString", "MaterialSize"];
  }
}
