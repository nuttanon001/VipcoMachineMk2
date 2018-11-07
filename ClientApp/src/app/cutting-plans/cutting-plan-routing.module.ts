import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CuttingPlanCenterComponent } from './cutting-plan-center.component';
import { CuttingPlanMasterComponent } from './cutting-plan-master/cutting-plan-master.component';
import { CuttingPlanImportComponent } from './cutting-plan-import/cutting-plan-import.component';
import { CuttingPlanNotFinishComponent } from './cutting-plan-not-finish/cutting-plan-not-finish.component';
import { CuttingPlanNoUseMasterComponent } from './cutting-plan-master/cutting-plan-nouse-master.component';

const routes: Routes = [{
  path: "",
  component: CuttingPlanCenterComponent,
  children: [
    {
      path: "import-csv",
      component: CuttingPlanImportComponent,
    },
    {
      path: "not-finish",
      component: CuttingPlanNotFinishComponent,
    }, 
    {
      path: "no-use",
       component: CuttingPlanNoUseMasterComponent,
    },
    {
      path: ":key",
      component: CuttingPlanMasterComponent,
    },
    {
      path: "",
      component: CuttingPlanMasterComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuttingPlanRoutingModule { }
