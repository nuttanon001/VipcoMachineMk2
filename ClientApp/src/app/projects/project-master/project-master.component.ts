import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { BaseMasterComponent } from '../../shared/base-master-component';
import { ProjectMaster } from '../shared/project-master.model';
import { ProjectMasterService } from '../shared/project-master.service';
import { ProjectMasterCommuncateService } from '../shared/project-master-communcate.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { AuthService } from '../../core/auth/auth.service';
import { ProjectTableComponent } from '../../dialogs/project-dialog/project-table/project-table.component';

@Component({
  selector: 'app-project-master',
  templateUrl: './project-master.component.html',
  styleUrls: ['./project-master.component.scss']
})
export class ProjectMasterComponent extends BaseMasterComponent<ProjectMaster,ProjectMasterService,ProjectMasterCommuncateService> {

  constructor(
    service: ProjectMasterService,
    serviceCommuncate: ProjectMasterCommuncateService,
    serviceDialos: DialogsService,
    serviceAuth: AuthService,
    viewContainerRef:ViewContainerRef,
  ) {
    super(service, serviceCommuncate, serviceAuth, serviceDialos, viewContainerRef);
  }

  @ViewChild(ProjectTableComponent)
  private tableComponent: ProjectTableComponent;

  onReloadData(): void {
    this.tableComponent.reloadData();
  }

  onCheckStatus(infoValue?: ProjectMaster): boolean {
    return true;
  }
}
