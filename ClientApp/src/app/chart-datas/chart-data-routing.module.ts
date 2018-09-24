import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartDataCenterComponent } from './chart-data-center.component';
import { TaskMachineReportComponent } from './task-machine-report/task-machine-report.component';

const routes: Routes = [{
  path: "",
  component: ChartDataCenterComponent,
  children: [
    {
      path: "taskmachine-summary",
      component: TaskMachineReportComponent,
    },
    {
      path: "",
      component: TaskMachineReportComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartDataRoutingModule { }
