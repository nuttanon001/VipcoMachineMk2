import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobcardMasterCenterComponent } from './jobcard-master-center.component';
import { JobcardMasterComponent } from './jobcard-master/jobcard-master.component';
import { JobcardMasterWaitingComponent } from './jobcard-master-waiting/jobcard-master-waiting.component';
import { JobcardMasterWaitingLmsmComponent } from './jobcard-master-waiting-lmsm/jobcard-master-waiting-lmsm.component';

const routes: Routes = [{
  path: "",
  component: JobcardMasterCenterComponent,
  children: [
    {
      path: "waiting/:condition",
      component: JobcardMasterWaitingComponent,
    },
    {
      path: "waiting",
      component: JobcardMasterWaitingComponent,
    },
    {
      path: "waiting-lmsm",
      component: JobcardMasterWaitingLmsmComponent,
    },
    {
      path: ":key",
      component: JobcardMasterComponent,
    },
    {
      path: "",
      component: JobcardMasterComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobcardMasterRoutingModule { }
