import { Component, OnInit, Inject } from '@angular/core';
import { BaseMasterDialogComponent } from '../../shared/base-master-dialog.component';
import { CuttingPlan } from '../../cutting-plans/shared/cutting-plan.model';
import { CuttingPlanService } from '../../cutting-plans/shared/cutting-plan.service';
import { CuttingPlanCommuncateService } from '../../cutting-plans/shared/cutting-plan-communcate.service';
import { AuthService } from '../../core/auth/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogsService } from '../shared/dialogs.service';

@Component({
  selector: 'app-cutting-plan-dialog',
  templateUrl: './cutting-plan-dialog.component.html',
  styleUrls: ['./cutting-plan-dialog.component.scss'],
  providers: [
    CuttingPlanService,
    CuttingPlanCommuncateService,
  ]
})
export class CuttingPlanDialogComponent extends BaseMasterDialogComponent
  <CuttingPlan, CuttingPlanService, CuttingPlanCommuncateService> {
  constructor(
    service: CuttingPlanService,
    serviceCom: CuttingPlanCommuncateService,
    serviceAuth: AuthService,
    dialogRef: MatDialogRef<CuttingPlanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public mode: number
  ) {
    super(service, serviceCom, serviceAuth, dialogRef);
  }
  // on init
  onInit(): void {
    this.fastSelectd = this.mode === 0 ? true : false;
  }
}
