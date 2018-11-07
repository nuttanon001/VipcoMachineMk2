import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { BaseMasterComponent } from '../../shared/base-master-component';
import { CuttingPlan } from '../shared/cutting-plan.model';
import { CuttingPlanService } from '../shared/cutting-plan.service';
import { CuttingPlanCommuncateService } from '../shared/cutting-plan-communcate.service';
import { AuthService } from '../../core/auth/auth.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { CuttingPlanTableComponent } from '../cutting-plan-table/cutting-plan-table.component';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-cutting-plan-master',
  templateUrl: './cutting-plan-master.component.html',
  styleUrls: ['./cutting-plan-master.component.scss']
})
export class CuttingPlanMasterComponent extends BaseMasterComponent<CuttingPlan,CuttingPlanService,CuttingPlanCommuncateService> {
  constructor(
    service: CuttingPlanService,
    serviceCom: CuttingPlanCommuncateService,
    serviceAuth: AuthService,
    serviceDia: DialogsService,
    viewConRef: ViewContainerRef
  ) { super(service, serviceCom, serviceAuth, serviceDia, viewConRef); }

  @ViewChild(CuttingPlanTableComponent)
  private tableComponent: CuttingPlanTableComponent;
  noUse: boolean = false;

  onReloadData(): void {
    this.tableComponent.reloadData();
  }

  onCheckStatus(infoValue?: CuttingPlan): boolean {
    return true; 
  }
}
