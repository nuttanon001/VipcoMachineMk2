import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BaseInfoComponent } from '../../shared/base-info-component';
import { StandardTime } from '../shared/standard-time.model';
import { StandardTimeService } from '../shared/standard-time.service';
import { StandardTimeCommuncateService } from '../shared/standard-time-communcate.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { TypeStandardTime } from '../shared/type-standard-time.model';
import { TypeStandardTimeService } from '../shared/type-standard-time.service';

@Component({
  selector: 'app-standard-time-info',
  templateUrl: './standard-time-info.component.html',
  styleUrls: ['./standard-time-info.component.scss']
})
export class StandardTimeInfoComponent extends BaseInfoComponent<StandardTime, StandardTimeService, StandardTimeCommuncateService> {

  constructor(
    service: StandardTimeService,
    serviceCommuncate: StandardTimeCommuncateService,
    private serviceTypeStandard:TypeStandardTimeService,
    private fb: FormBuilder,
    private serviceDialogs: DialogsService,
    private viewContainerRef: ViewContainerRef
  ) { super(service, serviceCommuncate); }

  //On get data from api
  onGetDataByKey(InfoValue?: StandardTime): void {
    if (InfoValue) {
      this.service.getOneKeyNumber(InfoValue)
        .subscribe(dbData => {
          this.InfoValue = dbData;
          if (this.InfoValue.TypeStandardTimeId) {
            this.serviceTypeStandard.getOneKeyNumber({ TypeStandardTimeId: this.InfoValue.TypeStandardTimeId })
              .subscribe(dbData => {
                this.InfoValue.TypeStandardTimeId = dbData.TypeStandardTimeId;
                this.InfoValue.TypeStandardTimeString = dbData.Name;
                //Patch to form
                this.InfoValueForm.patchValue({
                  TypeStandardTimeId: this.InfoValue.TypeStandardTimeId,
                  TypeStandardTimeString: this.InfoValue.TypeStandardTimeString,
                });
              });
          }
        }, error => console.error(error), () => this.buildForm());
    } else {
      this.InfoValue = { StandardTimeId: 0};
      this.buildForm();
    }
  }
  //BulidForm
  buildForm(): void {
    this.InfoValueForm = this.fb.group({
      StandardTimeId: [this.InfoValue.StandardTimeId],
      StandardTimeCode: [this.InfoValue.StandardTimeCode,
        [
          Validators.required,
          Validators.maxLength(50)
        ]
      ],
      Description: [this.InfoValue.Description,
        [
          Validators.required,
          Validators.maxLength(250),
        ]
      ],
      Remark: [this.InfoValue.Remark,
        [
          Validators.maxLength(250),
        ]
      ],
      StandardTimeValue: [this.InfoValue.StandardTimeValue,
        [
          Validators.min(0),
          Validators.required,
        ]
      ],
      PreparationBefor: [this.InfoValue.PreparationBefor,[ Validators.min(0) ]],
      PreparationAfter: [this.InfoValue.PreparationAfter,[ Validators.min(0) ]],
      CalculatorTime: [this.InfoValue.CalculatorTime], 
      // BaseModel
      Creator: [this.InfoValue.Creator],
      CreateDate: [this.InfoValue.CreateDate],
      Modifyer: [this.InfoValue.Modifyer],
      ModifyDate: [this.InfoValue.ModifyDate],
      // FK
      GradeMaterialId: [this.InfoValue.GradeMaterialId],
      TypeStandardTimeId: [this.InfoValue.TypeStandardTimeId],
      // ViewModel
      GradeMaterialString: [this.InfoValue.GradeMaterialString],
      TypeStandardTimeString: [this.InfoValue.TypeStandardTimeString,[Validators.required]],
    });
    this.InfoValueForm.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe(data => this.onValueChanged(data));
  }
  //OpenDialog
  openDialog(type: string = ""): void {
    if (type) {
      if (type.indexOf("TypeStandardTime") !== -1) {
        this.serviceDialogs.dialogInfoTypeStandardTime(this.viewContainerRef)
          .subscribe((typeStandard: TypeStandardTime) => {
            this.InfoValueForm.patchValue({
              TypeStandardTimeId: typeStandard ? typeStandard.TypeStandardTimeId : undefined,
              TypeStandardTimeString: typeStandard ? typeStandard.Name : undefined,
            });
          });
      }
    }
  }
}
