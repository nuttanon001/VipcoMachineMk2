import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectCenterComponent } from './project-center.component';
import { ProjectMasterComponent } from './project-master/project-master.component';

const routes: Routes = [{
  path: "",
  component: ProjectCenterComponent,
  children: [
    {
      path: ":key",
      component: ProjectMasterComponent,
    },
    {
      path: "",
      component: ProjectMasterComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
