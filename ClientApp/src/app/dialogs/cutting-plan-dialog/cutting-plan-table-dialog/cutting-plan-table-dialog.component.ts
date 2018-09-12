import { Component, OnInit } from '@angular/core';
import { CuttingPlanTableComponent } from '../../../cutting-plans/cutting-plan-table/cutting-plan-table.component';
import { CuttingPlanService } from '../../../cutting-plans/shared/cutting-plan.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-cutting-plan-table-dialog',
  templateUrl: '../../../cutting-plans/cutting-plan-table/cutting-plan-table.component.html',
  styleUrls: ['./cutting-plan-table-dialog.component.scss']
})
export class CuttingPlanTableDialogComponent extends CuttingPlanTableComponent {
  constructor(
    service: CuttingPlanService,
    serviceAuth: AuthService,
    ) {
    super(service, serviceAuth);
  }
}
