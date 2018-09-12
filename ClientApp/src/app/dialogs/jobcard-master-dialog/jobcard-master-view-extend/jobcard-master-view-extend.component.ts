import { Component, OnInit, ViewContainerRef, Input, Output, EventEmitter } from '@angular/core';
import { JobcardMasterInfoComponent } from '../../../jobcard-masters/jobcard-master-info/jobcard-master-info.component';
import { JobcardMasterService } from '../../../jobcard-masters/shared/jobcard-master.service';
import { JobcardMasterCommuncateService } from '../../../jobcard-masters/shared/jobcard-master-communcate.service';
import { EmployeeGroupService } from '../../../employees/shared/employee-group.service';
import { JobcardDetailService } from '../../../jobcard-masters/shared/jobcard-detail.service';
import { TypeMachineService } from '../../../machines/shared/type-machine.service';
import { DialogsService } from '../../shared/dialogs.service';
import { FormBuilder } from '@angular/forms';
import { JobcardMaster } from '../../../jobcard-masters/shared/jobcard-master.model';
import { AuthService } from '../../../core/auth/auth.service';
import { JobcardDetail } from '../../../jobcard-masters/shared/jobcard-detail.model';
import { JobcardDetailStatus } from '../../../jobcard-masters/shared/jobcard-detail-status.enum';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { JobcardDetailDialogComponent } from '../../jobcard-detail-dialog/jobcard-detail-dialog.component';
import { UserService } from '../../../users/shared/user.service';

@Component({
  selector: 'app-jobcard-master-view-extend',
  templateUrl: './jobcard-master-view-extend.component.html',
  styleUrls: ['./jobcard-master-view-extend.component.scss'],
  providers: [UserService]
})
export class JobcardMasterViewExtendComponent extends JobcardMasterInfoComponent {

  constructor(
    service: JobcardMasterService,
    serviceCom: JobcardMasterCommuncateService,
    serviceGroup: EmployeeGroupService,
    serivceUser: UserService,
    serviceAuth: AuthService,
    serviceJobDetail: JobcardDetailService,
    serviceTypeMachine: TypeMachineService,
    serviceDialogs: DialogsService,
    viewContainerRef: ViewContainerRef,
    fb: FormBuilder,
    private dialog: MatDialog) {
    super(service, serviceCom, serviceGroup, serivceUser, serviceAuth, serviceJobDetail, serviceTypeMachine, serviceDialogs, viewContainerRef, fb);
  }
  // Option Paramter
  @Input() jobCardDetailId: number;
  @Output() jobCardDetail: EventEmitter<JobcardDetail> = new EventEmitter<JobcardDetail>();

  optionEdit: boolean = false;
  // on get data from ley
  onGetDataByKey(InfoValue?: JobcardMaster): void {
    if (InfoValue) {
      this.service.getOneKeyNumber(InfoValue)
        .subscribe(dbData => {
          this.InfoValue = dbData;
          if (this.InfoValue) {
            if (this.jobCardDetailId) {
              this.serviceJobDetail.getOneKeyNumber({ JobCardDetailId: this.jobCardDetailId })
                .subscribe(dbDetail => {
                  this.InfoValue.JobCardDetails = new Array;
                  this.InfoValue.JobCardDetails.push(Object.assign({}, dbDetail));
                  this.InfoValueForm.patchValue({
                    JobCardDetails: this.InfoValue.JobCardDetails
                  });
                });
            } else {
              this.optionEdit = true;
              this.serviceJobDetail.getByMasterId(this.InfoValue.JobCardMasterId)
                .subscribe(dbDetail => {
                  this.InfoValue.JobCardDetails = new Array;
                  if (dbDetail) {
                    this.InfoValue.JobCardDetails = dbDetail.slice();
                  }
                  this.InfoValueForm.patchValue({
                    JobCardDetails: this.InfoValue.JobCardDetails
                  });
                })
            }
          }
        }, error => console.error(error), () => this.buildForm());
    } 
  }

  // On JobcardDetail
  OnDetailSelect(Item: { data?: JobcardDetail, option: number }) {
    if (this.denySave && !this.optionEdit) {
      return;
    }
    // console.log(JSON.stringify(Item));
    if (Item) {
      if (!Item.data) {
        this.indexItem = -1;
      } else {
        this.indexItem = this.InfoValue.JobCardDetails.indexOf(Item.data);
      }

      if (Item.option === 1) {
        let detailInfoValue: JobcardDetail;
        // IF Edit data
        if (Item.data) {
          detailInfoValue = Object.assign({}, Item.data);
          this.jobCardDetail.emit(detailInfoValue);
          return;
        } else { // Else New data
          detailInfoValue = {
            JobCardDetailId: 0,
            JobCardDetailStatus: JobcardDetailStatus.Wait,
            JobCardMasterId: this.InfoValue.JobCardMasterId,
          };
        }

        let config: MatDialogConfig = new MatDialogConfig();
        config.viewContainerRef = this.viewContainerRef;
        config.hasBackdrop = true;
        config.data = { data: detailInfoValue, option: false } ;

        const dialogRef = this.dialog.open(JobcardDetailDialogComponent, config);
        dialogRef.afterClosed().subscribe(jobCardDetail => {
          if (jobCardDetail) {
            this.jobCardDetail.emit(jobCardDetail);
          }
        });
      }
      else if (Item.option === 0) // Remove
      {
        this.InfoValue.JobCardDetails.splice(this.indexItem, 1);
        this.InfoValue.JobCardDetails = this.InfoValue.JobCardDetails.slice();
        // Update to form
        this.InfoValueForm.patchValue({
          JobCardDetails: this.InfoValue.JobCardDetails
        });
      }
    }
  }
}
