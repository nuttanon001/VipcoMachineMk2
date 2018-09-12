import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// Modules
import { CuttingPlanRoutingModule } from './cutting-plan-routing.module';
import { CustomMaterialModule } from '../shared/customer-material.module';
// Services
import { CuttingPlanService } from './shared/cutting-plan.service';
import { CuttingPlanCommuncateService } from './shared/cutting-plan-communcate.service';
// Components
import { CuttingPlanCenterComponent } from './cutting-plan-center.component';
import { CuttingPlanInfoComponent } from './cutting-plan-info/cutting-plan-info.component';
import { CuttingPlanTableComponent } from './cutting-plan-table/cutting-plan-table.component';
import { CuttingPlanMasterComponent } from './cutting-plan-master/cutting-plan-master.component';
import { CuttingPlanImportComponent } from './cutting-plan-import/cutting-plan-import.component';
import { CuttingPlanNotFinishComponent } from './cutting-plan-not-finish/cutting-plan-not-finish.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    CuttingPlanRoutingModule
  ],
  declarations: [
    CuttingPlanCenterComponent,
    CuttingPlanTableComponent,
    CuttingPlanMasterComponent,
    CuttingPlanInfoComponent,
    CuttingPlanImportComponent,
    CuttingPlanNotFinishComponent
  ],
  providers: [
    CuttingPlanService,
    CuttingPlanCommuncateService
  ]
})
export class CuttingPlanModule { }
