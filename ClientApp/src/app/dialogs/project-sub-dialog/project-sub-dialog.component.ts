import { Component, OnInit, Inject } from '@angular/core';
import { BaseDialogComponent } from '../../shared/base-dialog.component';
import { ProjectSub } from '../../projects/shared/project-sub.model';
import { ProjectSubService } from '../../projects/shared/project-sub.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-project-sub-dialog',
  templateUrl: './project-sub-dialog.component.html',
  styleUrls: ['./project-sub-dialog.component.scss'],
  providers: [ProjectSubService]
})
export class ProjectSubDialogComponent extends BaseDialogComponent<ProjectSub, ProjectSubService> {

  constructor(
    public service: ProjectSubService,
    public dialogRef: MatDialogRef<ProjectSubDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public InfoValue?: ProjectSub
  ) {
    super(service, dialogRef);
  }

  // on init
  onInit(): void {
    this.fastSelectd = this.InfoValue.ProjectCodeDetailId === -99;
  }

  // on complate or cancel entity
  onComplateOrCancelEntity(infoValue?: { data: ProjectSub | undefined, force: boolean }): void {
    if (infoValue) {
      if (infoValue.data) {
        this.getValue = infoValue.data;
        if (infoValue.force) {
          this.onSelectedClick();
        }
      }
    }
  }
}
