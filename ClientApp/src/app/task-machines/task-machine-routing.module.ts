import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskMachineCenterComponent } from './task-machine-center.component';
import { TaskMachineMasterComponent } from './task-machine-master/task-machine-master.component';
import { TaskMachineScheduleComponent } from './task-machine-schedule/task-machine-schedule.component';
import { AuthGuard } from '../core/auth/auth-guard.service';

const routes: Routes = [{
  path: "",
  component: TaskMachineCenterComponent,
  children: [
    {
      path: "progress/:taskid/:jobid",
      component: TaskMachineMasterComponent,
      canActivate: [AuthGuard],
    },
    {
      path: "machine-schedule-only/:mode",
      component: TaskMachineScheduleComponent,
    },
    {
      path: "machine-schedule/:mode",
      component: TaskMachineScheduleComponent,
      canActivate: [AuthGuard]
    },
    {
      path: "link-mail/:taskid",
      component: TaskMachineScheduleComponent,
    },
    {
      path: "machine-schedule",
      component: TaskMachineScheduleComponent,
      canActivate: [AuthGuard]
    },
    {
      path: "report-taskmachine/:report",
      component: TaskMachineMasterComponent,
      canActivate: [AuthGuard]
    },
    {
      path: ":key",
      component: TaskMachineMasterComponent,
      canActivate: [AuthGuard]
    },
    {
      path: "",
      component: TaskMachineMasterComponent,
      canActivate: [AuthGuard]
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskMachineRoutingModule { }
