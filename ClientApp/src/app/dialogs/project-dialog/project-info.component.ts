import { Component, OnInit } from '@angular/core';
import { BaseInfoDialogComponent } from '../../shared/base-info-dialog-component';
import { ProjectMaster } from '../../projects/shared/project-master.model';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent extends BaseInfoDialogComponent<ProjectMaster> {

  constructor(
    private fb: FormBuilder
  ) {
    super();
  }

  buildForm(): void {
    this.InfoValueForm = this.fb.group({
      ProjectCodeMasterId: [this.InfoValue.ProjectCodeMasterId],
      ProjectCode: [this.InfoValue.ProjectCode,
        [
          Validators.required,
          Validators.maxLength(50)
        ]
      ],
      ProjectName: [this.InfoValue.ProjectName,
        [
          Validators.maxLength(200)
        ]
      ],
      StartDate: [this.InfoValue.StartDate],
      EndDate: [this.InfoValue.EndDate],
      //BaseModel
      CreateDate: [this.InfoValue.CreateDate],
      Creator: [this.InfoValue.Creator],
      ModifyDate: [this.InfoValue.ModifyDate],
      Modifyer: [this.InfoValue.Modifyer],
      //Relation
      ProjectCodeSub: [this.InfoValue.ProjectCodeSub]
    });
  }
}
