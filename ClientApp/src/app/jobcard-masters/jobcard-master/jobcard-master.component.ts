import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { BaseMasterComponent } from '../../shared/base-master-component';
import { JobcardMaster } from '../shared/jobcard-master.model';
import { JobcardMasterService } from '../shared/jobcard-master.service';
import { JobcardMasterCommuncateService } from '../shared/jobcard-master-communcate.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { AuthService } from '../../core/auth/auth.service';
import { JobcardMasterTableComponent } from '../jobcard-master-table/jobcard-master-table.component';
import { JobcardDetailStatus } from '../shared/jobcard-detail-status.enum';
import { JobcardMasterStatus } from '../shared/jobcard-master-status.enum';

@Component({
  selector: 'app-jobcard-master',
  templateUrl: './jobcard-master.component.html',
  styleUrls: ['./jobcard-master.component.scss']
})
export class JobcardMasterComponent extends BaseMasterComponent<JobcardMaster, JobcardMasterService, JobcardMasterCommuncateService> {

  constructor(
    service: JobcardMasterService,
    serviceCommuncate: JobcardMasterCommuncateService,
    serviceDialos: DialogsService,
    serviceAuth: AuthService,
    viewContainerRef: ViewContainerRef,
  ) {
    super(service, serviceCommuncate, serviceAuth, serviceDialos, viewContainerRef);
  }

  @ViewChild(JobcardMasterTableComponent)
  private tableComponent: JobcardMasterTableComponent;
  // on reload data
  onReloadData(): void {
    this.tableComponent.reloadData();
  }
  // on check status
  onCheckStatus(infoValue?: JobcardMaster): boolean {
    if (this.authService.getAuth) {
      if (this.authService.getAuth.LevelUser < 3) {
        if (this.authService.getAuth.UserName !== infoValue.Creator) {
          this.dialogsService.error("Access Denied", "You don't have permission to access.", this.viewContainerRef);
          return false;
        }
        if (infoValue.JobCardMasterStatus != JobcardMasterStatus.Wait && infoValue.JobCardMasterStatus != JobcardMasterStatus.InProcess) {
          this.dialogsService.error("Access Deny", "คำขอตรวจสอบคุณภาพ ได้รับการดำเนินการไม่สามารถแก้ไขได้ !!!", this.viewContainerRef);
          return false;
        }
      }
    }
    return true;
  }
  // on insert data
  onInsertToDataBase(value: JobcardMaster): void {
    if (this.authService.getAuth) {
      value["Creator"] = this.authService.getAuth.UserName || "";
    }
    let attachs: FileList | undefined = value.AttachFile;
    // insert data
    this.service.addModel(value).subscribe(
      (complete: any) => {
        if (complete && attachs) {
          this.onAttactFileToDataBase(complete.JobCardMasterId, attachs, complete.Creator || "");
        }
        //Debug here
        console.log(JSON.stringify(complete));

        if (complete) {
          this.displayValue = complete;
          this.onSaveComplete();
        }
        if (this.onLoading) {
          this.onLoading = false;
        }
      },
      (error: any) => {
        console.error(error);
        this.dialogsService.error("Failed !",
          "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
      }
    );
  }
  // on update data
  onUpdateToDataBase(value: JobcardMaster): void {
    if (this.authService.getAuth) {
      value["Modifyer"] = this.authService.getAuth.UserName || "";
    }
    let attachs: FileList | undefined = value.AttachFile;
    // remove attach
    if (value.RemoveAttach) {
      this.onRemoveFileFromDataBase(value.RemoveAttach);
    }
    // update data
    this.service.updateModelWithKey(value).subscribe(
      (complete: any) => {
        if (complete && attachs) {
          this.onAttactFileToDataBase(complete.JobCardMasterId, attachs, complete.Modifyer || "Someone");
        }

        if (complete) {
          this.displayValue = complete;
          this.onSaveComplete();
        }
        if (this.onLoading) {
          this.onLoading = false;
        }
      },
      (error: any) => {
        console.error(error);
        this.dialogsService.error("Failed !",
          "Save failed with the following error: Invalid Identifier code !!!", this.viewContainerRef);
      }
    );
  }
  ////////////
  // Attach //
  ////////////
  // on attact file
  onAttactFileToDataBase(JobCardMasterId: number, Attacts: FileList, CreateBy: string): void {
    this.service.postAttactFile2(JobCardMasterId, Attacts, CreateBy);
      // .subscribe(complate => console.log("Upload Complate"), error => console.error(error));
  }

  // on remove file
  onRemoveFileFromDataBase(Attachs: Array<number>): void {
    Attachs.forEach((value: number) => {
      this.service.deleteAttactFile(value)
        .subscribe(complate => console.log("Delete Complate"), error => console.error(error));
    });
  }
}
