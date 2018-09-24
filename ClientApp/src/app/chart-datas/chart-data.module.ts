import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartDataRoutingModule } from './chart-data-routing.module';
import { ChartDataCenterComponent } from './chart-data-center.component';
import { TaskMachineChartComponent } from './task-machine-chart/task-machine-chart.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../shared/customer-material.module';
import { TaskMachineService } from '../task-machines/shared/task-machine.service';
import { TaskMachineReportComponent } from './task-machine-report/task-machine-report.component';
import { TypeMachineService } from '../machines/shared/type-machine.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    ChartDataRoutingModule
  ],
  declarations: [
    ChartDataCenterComponent,
    TaskMachineReportComponent,
    TaskMachineChartComponent,
  ],
  providers: [
    TaskMachineService,
    TypeMachineService
  ]
})
export class ChartDataModule { }
