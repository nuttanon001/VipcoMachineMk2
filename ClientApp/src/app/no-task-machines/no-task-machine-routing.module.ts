import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoTaskCenterComponent } from './no-task-center.component';
import { NoTaskMasterComponent } from './no-task-master/no-task-master.component';

const routes: Routes = [{
  path: "",
  component: NoTaskCenterComponent,
  children: [
    {
      path: ":key",
      component: NoTaskMasterComponent,
    },
    {
      path: "",
      component: NoTaskMasterComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoTaskMachineRoutingModule { }
