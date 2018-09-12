import { Component, OnInit } from '@angular/core';
import { BaseInfoDialogComponent } from '../../shared/base-info-dialog-component';
import { ProjectSub } from '../../projects/shared/project-sub.model';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-project-sub-info',
  templateUrl: './project-sub-info.component.html',
  styleUrls: ['./project-sub-info.component.scss']
})
export class ProjectSubInfoComponent extends BaseInfoDialogComponent<ProjectSub> {

  constructor(
    private fb: FormBuilder
  ) { super() }

  buildForm(): void {
    this.InfoValueForm = this.fb.group({
      ProjectCodeDetailId: [this.InfoValue.ProjectCodeDetailId],
      ProjectCodeDetailCode: [this.InfoValue.ProjectCodeDetailCode,
        [
          Validators.required,
          Validators.maxLength(50)
        ]
      ],
      Description: [this.InfoValue.Description, [Validators.maxLength(200)]],
      ProjectCodeMasterId: [this.InfoValue.ProjectCodeMasterId],
      //BaseMode
      CreateDate: [this.InfoValue.CreateDate],
      Creator: [this.InfoValue.Creator],
      ModifyDate: [this.InfoValue.ModifyDate],
      Modifyer: [this.InfoValue.Modifyer],
    });

    this.InfoValueForm.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe(data => {
      if (!this.InfoValueForm) { return; }
      if (this.InfoValueForm.valid) {
        this.InfoValue = this.InfoValueForm.value;
        this.SubmitOrCancel.emit({ data: this.InfoValue, force: false });
      }
    });
  }
}
