import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MachineCenterComponent } from './machine-center.component';
import { MachineMasterComponent } from './machine-master/machine-master.component';

const routes: Routes = [{
  path: "",
  component: MachineCenterComponent,
  children: [
    {
      path: ":key",
      component: MachineMasterComponent,
    },
    {
      path: "",
      component: MachineMasterComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MachineRoutingModule { }
