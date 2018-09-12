import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CuttingPlanInfoComponent } from '../../../cutting-plans/cutting-plan-info/cutting-plan-info.component';
import { CuttingPlan } from '../../../cutting-plans/shared/cutting-plan.model';
import { CuttingPlanService } from '../../../cutting-plans/shared/cutting-plan.service';
import { CuttingPlanCommuncateService } from '../../../cutting-plans/shared/cutting-plan-communcate.service';
import { DialogsService } from '../../shared/dialogs.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-cutting-plan-info-dialog',
  templateUrl: '../../../cutting-plans/cutting-plan-info/cutting-plan-info.component.html',
  styleUrls: ['./cutting-plan-info-dialog.component.scss']
})
export class CuttingPlanInfoDialogComponent extends CuttingPlanInfoComponent {
  constructor(
    service: CuttingPlanService,
    serviceCom: CuttingPlanCommuncateService,
    serviceDialog: DialogsService,
    viewCon: ViewContainerRef,
    fb: FormBuilder
  ) {
    super(service, serviceCom, serviceDialog, viewCon, fb);
  }
}
