//Angular Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// Modules
import { ProjectRoutingModule } from './project-routing.module';
import { CustomMaterialModule } from '../shared/customer-material.module';
// Services
import { ProjectSubService } from './shared/project-sub.service';
import { ProjectMasterService } from './shared/project-master.service';
import { ProjectMasterCommuncateService } from './shared/project-master-communcate.service';
// Components
import { ProjectCenterComponent } from './project-center.component';
import { ProjectInfoComponent } from './project-info/project-info.component';
import { ProjectTableComponent } from './project-table/project-table.component';
import { ProjectMasterComponent } from './project-master/project-master.component';
import { ProjectSubTableComponent } from './project-sub-table/project-sub-table.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    ProjectRoutingModule
  ],
  declarations: [
    ProjectCenterComponent,
    ProjectMasterComponent,
    ProjectTableComponent,
    ProjectInfoComponent,
    ProjectSubTableComponent
  ],
  providers: [
    ProjectMasterService,
    ProjectMasterCommuncateService,
    ProjectSubService,
  ]
})
export class ProjectModule { }
