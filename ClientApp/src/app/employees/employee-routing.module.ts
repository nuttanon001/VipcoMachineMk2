import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeCenterComponent } from './employee-center.component';
import { EmployeeMasterComponent } from './employee-master/employee-master.component';

const routes: Routes = [{
  path: "",
  component: EmployeeCenterComponent,
  children: [
    {
      path: ":key",
      component: EmployeeMasterComponent,
    },
    {
      path: "",
      component: EmployeeMasterComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
