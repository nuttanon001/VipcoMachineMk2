import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { BaseInfoDialogComponent } from '../../shared/base-info-dialog-component';
import { JobcardDetail } from '../../jobcard-masters/shared/jobcard-detail.model';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime,distinctUntilChanged } from 'rxjs/operators';
import { DialogsService } from '../shared/dialogs.service';
import { CuttingPlan } from '../../cutting-plans/shared/cutting-plan.model';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CuttingPlanDialogComponent } from '../cutting-plan-dialog/cutting-plan-dialog.component';
import { AutoComplate } from '../../shared/auto-complate';
import { ResultAutoComplate } from '../../shared/result-auto-complate';
import { JobcardDetailService } from '../../jobcard-masters/shared/jobcard-detail.service';

@Component({
  selector: 'app-jobcard-detail-info',
  templateUrl: './jobcard-detail-info.component.html',
  styleUrls: ['./jobcard-detail-info.component.scss'],
})
export class JobcardDetailInfoComponent extends BaseInfoDialogComponent<JobcardDetail> {

  constructor(
    private fb: FormBuilder,
    private service:JobcardDetailService,
    private serviceDialogs: DialogsService,
    private viewContainerRef: ViewContainerRef,
    private dialog: MatDialog
  ) { super(); }
  // Parameters
  @Input() isSplitOption: boolean = false;
  unitNumbers: Array<{ Lable: string, Value: number }>;
  qualityMax: number;
  resultAutoComplate: Array<ResultAutoComplate>;
  // Methods
  buildForm(): void {
    if (this.isSplitOption) {
      this.setStep(1);
    }

    if (!this.unitNumbers) {
      this.unitNumbers = new Array;
      for (let i: number = 1; i < 41; i++) {
        this.unitNumbers.push({
          Lable: `UnitNo. ${i}`,
          Value: i
        });
      }
    }
    this.qualityMax = this.InfoValue.Quality - 1;
    // Create Form Array
    this.InfoValueForm = this.fb.group({
      JobCardDetailId: [this.InfoValue.JobCardDetailId],
      Material: new FormControl({ value: this.InfoValue.Material, disabled: this.denySave },
        [Validators.maxLength(200)]
      ),
      // [this.InfoValue.Material,
      //   [
      //     Validators.maxLength(200),
      //   ]
      // ],
      Quality: new FormControl({ value: this.InfoValue.Quality, disabled: this.denySave },
        [Validators.min(0)]
      ),
        // [this.InfoValue.Quality,[Validators.min(0)]],
      UnitNo: new FormControl({ value: this.InfoValue.UnitNo, disabled: this.denySave }),
        // [this.InfoValue.UnitNo],
      JobCardDetailStatus: [this.InfoValue.JobCardDetailStatus],
      Remark: new FormControl({ value: this.InfoValue.Remark, disabled: this.denySave },
        [Validators.maxLength(200)]
      ),
      // [this.InfoValue.Remark,
      //   [
      //     Validators.maxLength(200)
      //   ]
      // ],
      // BaseModel
      Creator: [this.InfoValue.Creator],
      CreateDate: [this.InfoValue.CreateDate],
      Modifyer: [this.InfoValue.Modifyer],
      ModifyDate: [this.InfoValue.ModifyDate],
      // fK
      JobCardMasterId: [this.InfoValue.JobCardMasterId],
      UnitMeasureId: [this.InfoValue.UnitMeasureId],
      StandardTimeId: [this.InfoValue.StandardTimeId],
      CuttingPlanId: [this.InfoValue.CuttingPlanId],
      SplitFormJobCardId: [this.InfoValue.SplitFormJobCardId],
      // viewModel
      CuttingPlanString: [this.InfoValue.CuttingPlanString],
      StandardTimeString: [this.InfoValue.StandardTimeString],
      StatusString: [this.InfoValue.StatusString],
      SplitQuality: new FormControl({ value: this.InfoValue.SplitQuality },
        [Validators.max(this.qualityMax)]
      ),
    });

    // On Form Value
    this.InfoValueForm.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe(data => {
      if (!this.InfoValueForm) { return; }
      if (this.InfoValueForm.valid) {
        this.InfoValue = this.InfoValueForm.value;
        this.SubmitOrCancel.emit({ data: this.InfoValue, force: false });
      }
    });

    // Get Control
    this.InfoValueForm.get("Material").valueChanges
      .pipe(debounceTime(500), distinctUntilChanged()).subscribe((data: string) => {
        if (data) {
          this.fillAutoComplated({ ByColumn: "Material", Filter: data });
        } else {
          this.resultAutoComplate = new Array;
        }
      });
  }

  // fill auto complate
  fillAutoComplated(fillAuto: AutoComplate) {
    this.service.getAutoComplateEdition(fillAuto)
      .subscribe(resultAuto => {
        this.resultAutoComplate = new Array;
        if (resultAuto) {
          this.resultAutoComplate = [...resultAuto];
        }
      });
  }
  // open dialog
  openDialogs(type: string) {
    if (this.denySave) {
      return;
    }

    if (type) {
      let config: MatDialogConfig = new MatDialogConfig();
      config.viewContainerRef = this.viewContainerRef;
      config.data = 0;
      config.hasBackdrop = true;

      if (type.indexOf("CuttingPlan") !== -1) {
        const dialogRef = this.dialog.open(CuttingPlanDialogComponent, config);
        dialogRef.afterClosed().subscribe(cutting => {
          this.InfoValueForm.patchValue({
            CuttingPlanId: cutting ? cutting.CuttingPlanId : undefined,
            CuttingPlanString: cutting ? cutting.CuttingPlanNo : undefined,
            Material: cutting ? (cutting.MaterialSize ? (cutting.MaterialSize || "") + " " + (cutting.MaterialGrade || "") : "") : "",
            Quality: cutting ? cutting.Quantity || 1 : 0,
          });
        });
      } else if (type.indexOf("StandardTime") !== -1) {

      }
    }
  }
}
