// AngularCore
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
// Rxjs
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
// Services
import { CuttingPlanService } from '../shared/cutting-plan.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { CuttingPlanCommuncateService } from '../shared/cutting-plan-communcate.service';
// Components
import { BaseInfoComponent } from '../../shared/base-info-component';
// Models
import { CuttingPlan } from '../shared/cutting-plan.model';
import { ProjectSub } from '../../projects/shared/project-sub.model';
import { ProjectMaster } from '../../projects/shared/project-master.model';

@Component({
  selector: 'app-cutting-plan-info',
  templateUrl: './cutting-plan-info.component.html',
  styleUrls: ['./cutting-plan-info.component.scss']
})
export class CuttingPlanInfoComponent extends BaseInfoComponent<CuttingPlan, CuttingPlanService, CuttingPlanCommuncateService> {
  constructor(
    service: CuttingPlanService,
    serviceCom: CuttingPlanCommuncateService,
    private serviceDialogs: DialogsService,
    private viewContainerRef: ViewContainerRef,
    private fb: FormBuilder
  ) {
    super(service, serviceCom);
  }
  //On get data from api
  onGetDataByKey(InfoValue?: CuttingPlan): void {
    if (InfoValue) {
      this.service.getOneKeyNumber(InfoValue)
        .subscribe(dbData => {
          this.InfoValue = dbData;
        }, error => console.error(error), () => this.buildForm());
    } else {
      this.InfoValue = { CuttingPlanId: 0 };
      this.buildForm();
    }
  }
  //BulidForm
  buildForm(): void {
    this.InfoValueForm = this.fb.group({
      CuttingPlanId: [this.InfoValue.CuttingPlanId],
      CuttingPlanNo: [this.InfoValue.CuttingPlanNo,
        [
          Validators.required,
          Validators.maxLength(250)
        ]
      ],
      Description: [this.InfoValue.Description,
        [
          Validators.maxLength(200),
        ]
      ],
      Quantity: [this.InfoValue.Quantity,
        [
          Validators.min(0)
        ]
      ],
      Weight: [this.InfoValue.Weight,
        [
          Validators.min(0)
        ]
      ],
      MaterialSize: [this.InfoValue.MaterialSize,
        [
          Validators.maxLength(200),
        ]
      ],
      MaterialGrade: [this.InfoValue.MaterialGrade,
        [
          Validators.maxLength(200),
        ]
      ],
      TypeCuttingPlan: [this.InfoValue.TypeCuttingPlan,
        [
          Validators.required
        ]
      ],
      // BaseModel
      Creator: [this.InfoValue.Creator],
      CreateDate: [this.InfoValue.CreateDate],
      Modifyer: [this.InfoValue.Modifyer],
      ModifyDate: [this.InfoValue.ModifyDate],
      // FK
      ProjectCodeDetailId: [this.InfoValue.ProjectCodeDetailId],
      // ViewModel
      ProjectCodeString: [this.InfoValue.ProjectCodeString,
        [
          Validators.required,
        ]
      ],
      TypeCuttingPlanString: [this.InfoValue.TypeCuttingPlanString],
    });
    this.InfoValueForm.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe(data => this.onValueChanged(data));
  }
  //OpenDialog
  openDialog(type: string = ""): void {
    if (type) {
      if (type.indexOf("Project") !== -1) {
        this.serviceDialogs.dialogSelectProject(this.viewContainerRef, 2)
          .subscribe((projectMaster: ProjectMaster) => {
            this.InfoValueForm.patchValue({
              ProjectCodeDetailId: projectMaster ? projectMaster.ProjectCodeSub.ProjectCodeDetailId : undefined,
              ProjectCodeString: projectMaster ? `${projectMaster.ProjectCode}/${projectMaster.ProjectCodeSub.ProjectCodeDetailCode}` : undefined,
            });
          });
      }
    }
  }
}
