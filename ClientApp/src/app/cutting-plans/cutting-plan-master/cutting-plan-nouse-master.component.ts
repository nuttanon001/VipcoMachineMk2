import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { CuttingPlanService } from '../shared/cutting-plan.service';
import { CuttingPlanCommuncateService } from '../shared/cutting-plan-communcate.service';
import { AuthService } from '../../core/auth/auth.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { CuttingPlanMasterComponent } from './cutting-plan-master.component';

@Component({
  selector: 'app-cutting-plan-master',
  templateUrl: './cutting-plan-master.component.html',
  styleUrls: ['./cutting-plan-master.component.scss']
})
export class CuttingPlanNoUseMasterComponent extends CuttingPlanMasterComponent {
  constructor(
    service: CuttingPlanService,
    serviceCom: CuttingPlanCommuncateService,
    serviceAuth: AuthService,
    serviceDia: DialogsService,
    viewConRef: ViewContainerRef
  ) {
    super(service, serviceCom, serviceAuth, serviceDia, viewConRef);
    this.noUse = true;
  }
}
