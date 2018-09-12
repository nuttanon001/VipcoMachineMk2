import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StandardTimeCenterComponent } from './standard-time-center.component';
import { StandardTimeMasterComponent } from './standard-time-master/standard-time-master.component';

const routes: Routes = [{
  path: "",
  component: StandardTimeCenterComponent,
  children: [
    {
      path: ":key",
      component: StandardTimeMasterComponent,
    },
    {
      path: "",
      component: StandardTimeMasterComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StandardTimeRoutingModule { }
