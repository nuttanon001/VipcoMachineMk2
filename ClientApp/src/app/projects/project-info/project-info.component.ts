import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BaseInfoComponent } from '../../shared/base-info-component';
import { ProjectMaster } from '../shared/project-master.model';
import { ProjectMasterService } from '../shared/project-master.service';
import { ProjectMasterCommuncateService } from '../shared/project-master-communcate.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ProjectSubService } from '../shared/project-sub.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { debounceTime,distinctUntilChanged } from "rxjs/operators";
import { ProjectSub } from '../shared/project-sub.model';
@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent extends BaseInfoComponent<ProjectMaster,ProjectMasterService,ProjectMasterCommuncateService> {

  constructor(
    service: ProjectMasterService,
    serviceCommuncate: ProjectMasterCommuncateService,
    private fb: FormBuilder,
    private serviceProDetail: ProjectSubService,
    private serviceDialogs: DialogsService,
    private viewContainerRef:ViewContainerRef
  ) { super(service, serviceCommuncate); }

  //On get data from api
  onGetDataByKey(InfoValue?: ProjectMaster): void {
    if (InfoValue) {
      this.service.getOneKeyNumber(InfoValue)
        .subscribe(dbData => {
          this.InfoValue = dbData;
          if (this.InfoValue) {
            this.serviceProDetail.getByMasterId(this.InfoValue.ProjectCodeMasterId)
              .subscribe(dbDetail => {
                if (dbDetail) {
                  this.InfoValue.ProjectCodeDetails = new Array;
                  dbDetail.forEach(item => {
                    this.InfoValue.ProjectCodeDetails.push(Object.assign({}, item));
                  });
                }
              });
          }
        }, error => console.error(error), () => this.buildForm());
    } else {
      this.InfoValue = { ProjectCodeMasterId:0 ,ProjectCodeDetails:new Array};
      this.buildForm();
    }
  }
  //BulidForm
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
          Validators.required,
          Validators.maxLength(100),
        ]
      ],
      StartDate: [this.InfoValue.StartDate],
      EndDate: [this.InfoValue.EndDate],
      ProjectCodeDetails: [this.InfoValue.ProjectCodeDetails],
      // BaseModel
      Creator: [this.InfoValue.Creator],
      CreateDate: [this.InfoValue.CreateDate],
      Modifyer: [this.InfoValue.Modifyer],
      ModifyDate: [this.InfoValue.ModifyDate],
    });
    this.InfoValueForm.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe(data => this.onValueChanged(data));
  }
  //Parameter
  indexItem: number;
  // On BoMLowLevelSelect
  OnDetailSelect(Item: { data?: ProjectSub, option: number }) {
    if (Item) {

      if (!Item.data) {
        this.indexItem = -1;
      } else {
        this.indexItem = this.InfoValue.ProjectCodeDetails.indexOf(Item.data);
      }

      if (Item.option === 1) {
        let detailInfoValue: ProjectSub;
        // IF Edit data
        if (Item.data) {
          detailInfoValue = Object.assign({}, Item.data);
        } else { // Else New data
          detailInfoValue = {
            ProjectCodeDetailId : 0,
          };
        }
        // Send to dialog BomLowLevel
        this.serviceDialogs.dialogProjectSubInfo(this.viewContainerRef, detailInfoValue)
          .subscribe(complateData => {
            if (complateData) {
              if (this.indexItem > -1) {
                // remove item
                this.InfoValue.ProjectCodeDetails.splice(this.indexItem, 1);
              }

              // cloning an object
              this.InfoValue.ProjectCodeDetails.push(Object.assign({}, complateData));
              this.InfoValue.ProjectCodeDetails = this.InfoValue.ProjectCodeDetails.slice();
              // Update to form
              this.InfoValueForm.patchValue({
                ProjectCodeDetails: this.InfoValue.ProjectCodeDetails
              });
            }
          })
      }
      else if (Item.option === 0) // Remove
      {
        this.InfoValue.ProjectCodeDetails.splice(this.indexItem, 1);
        this.InfoValue.ProjectCodeDetails = this.InfoValue.ProjectCodeDetails.slice();
        // Update to form
        this.InfoValueForm.patchValue({
          ProjectCodeDetails: this.InfoValue.ProjectCodeDetails
        });
      }
    }
  }
}
