import { Component, OnInit } from '@angular/core';
import { BaseTableComponent } from '../../shared/base-table.component';
import { ProjectMaster } from '../shared/project-master.model';
import { ProjectMasterService } from '../shared/project-master.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.scss']
})
export class ProjectTableComponent extends BaseTableComponent<ProjectMaster,ProjectMasterService> {

  constructor(service: ProjectMasterService,serviceAuth:AuthService) {
    super(service, serviceAuth);
    this.displayedColumns = ["select", "ProjectCode", "ProjectName", "StartDate"];
  }
}
