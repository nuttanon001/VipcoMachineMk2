// Angular Core
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
// Components
import { BaseInfoComponent } from '../../shared/base-info-component';
// Services
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { JobcardDetailService } from '../shared/jobcard-detail.service';
import { JobcardMasterService } from '../shared/jobcard-master.service';
import { TypeMachineService } from '../../machines/shared/type-machine.service';
import { EmployeeGroupMisService } from '../../employees/shared/employee-group-mis.service';
import { JobcardMasterCommuncateService } from '../shared/jobcard-master-communcate.service';
// Models
import { AttachFile } from '../../shared/attach-file.model';
import { JobcardMaster } from '../shared/jobcard-master.model';
import { JobcardDetail } from '../shared/jobcard-detail.model';
import { ProjectSub } from '../../projects/shared/project-sub.model';
import { TypeMachine } from '../../machines/shared/type-machine.model';
import { ProjectMaster } from '../../projects/shared/project-master.model';
// Rxjs
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { JobcardMasterStatus } from '../shared/jobcard-master-status.enum';
import { JobcardDetailStatus } from '../shared/jobcard-detail-status.enum';
import { EmployeeGroup } from '../../employees/shared/employee-group.model';
import { EmployeeGroupService } from '../../employees/shared/employee-group.service';
import { AuthService } from '../../core/auth/auth.service';
import { EmployeeGroupMis } from '../../employees/shared/employee-group-mis.model';
import { UserService } from '../../users/shared/user.service';

@Component({
  selector: 'app-jobcard-master-info',
  templateUrl: './jobcard-master-info.component.html',
  styleUrls: ['./jobcard-master-info.component.scss'],
  providers: [UserService]
})
export class JobcardMasterInfoComponent extends BaseInfoComponent<JobcardMaster, JobcardMasterService, JobcardMasterCommuncateService> {
  constructor(
    service: JobcardMasterService,
    serviceCom: JobcardMasterCommuncateService,
    private serviceGroup: EmployeeGroupService,
    private serviceUser: UserService,
    private serviceAuth: AuthService,
    protected serviceJobDetail: JobcardDetailService,
    protected serviceTypeMachine: TypeMachineService,
    private serviceDialogs: DialogsService,
    public viewContainerRef: ViewContainerRef,
    protected fb: FormBuilder
  ) {
    super(service, serviceCom);
  }
  // Parameter
  indexItem: number;
  typeMachines: Array<TypeMachine>;
  attachFiles: Array<AttachFile> = new Array;
  //On get data from api
  onGetDataByKey(InfoValue?: JobcardMaster): void {
    if (InfoValue) {
      this.service.getOneKeyNumber(InfoValue)
        .subscribe(dbData => {
          this.InfoValue = dbData;
          if (this.InfoValue) {
            this.serviceJobDetail.getByMasterId(this.InfoValue.JobCardMasterId)
              .subscribe(dbDetail => {
                this.InfoValue.JobCardDetails = new Array;
                if (dbDetail) {
                  dbDetail.forEach(item => {
                    this.InfoValue.JobCardDetails.push(Object.assign({}, item));
                  });

                  this.InfoValueForm.patchValue({
                    JobCardDetails: this.InfoValue.JobCardDetails
                  });
                }
              });
          }
        }, error => console.error(error), () => this.buildForm());
    } else {
      this.InfoValue = {
        JobCardMasterId: 0,
        JobCardMasterStatus: JobcardMasterStatus.Wait,
        Weight: 0,
        JobCardDate: new Date,
        JobCardDetails: new Array
      };
      if (this.serviceAuth.getAuth) {
        this.InfoValue.EmployeeWriteString = this.serviceAuth.getAuth.NameThai;
        this.InfoValue.EmpWrite = this.serviceAuth.getAuth.EmpCode;
        this.InfoValue.MailReply = this.serviceAuth.getAuth.MailAddress;

        this.getEmployeeGroupMisByEmpCode(this.InfoValue.EmpWrite);
      }
      this.buildForm();
    }
  }
  //BulidForm
  buildForm(): void {
    if (!this.typeMachines) {
      this.typeMachines = new Array();
      this.serviceTypeMachine.getAll()
        .subscribe(dbData => {
          if (dbData) {
            this.typeMachines = dbData.slice();
          }
        });
    }
    this.getAttach();

    this.InfoValueForm = this.fb.group({
      JobCardMasterId: [this.InfoValue.JobCardMasterId],
      JobCardMasterNo: [this.InfoValue.JobCardMasterNo],
      JobCardMasterStatus: [this.InfoValue.JobCardMasterStatus],
      Description: new FormControl({ value: this.InfoValue.Description, disabled: this.denySave }, Validators.maxLength(200)),
      MailReply: new FormControl({value: this.InfoValue.MailReply,disabled:this.denySave},Validators.maxLength(200)),
      Remark: new FormControl({value:this.InfoValue.Remark,disabled:this.denySave},Validators.maxLength(200)),
      JobCardDate: new FormControl({ value: this.InfoValue.JobCardDate, disabled: this.denySave }, Validators.required),
      DueDate: new FormControl({ value: this.InfoValue.DueDate, disabled: this.denySave }, Validators.required),
      EmpWrite: [this.InfoValue.EmpWrite],
      EmpRequire: [this.InfoValue.EmpRequire],
      GroupCode: [this.InfoValue.GroupCode],
      ProjectCodeDetailId: [this.InfoValue.ProjectCodeDetailId],
      TypeMachineId: new FormControl({ value: this.InfoValue.TypeMachineId, disabled: this.denySave }, Validators.required),
      Weight: new FormControl({ value: this.InfoValue.Weight, disabled:this.denySave },Validators.min(0)),
      JobCardDetails: [this.InfoValue.JobCardDetails],
      // BaseModel
      Creator: [this.InfoValue.Creator],
      CreateDate: [this.InfoValue.CreateDate],
      Modifyer: [this.InfoValue.Modifyer],
      ModifyDate: [this.InfoValue.ModifyDate],
      //FK
      ProjectDetailString: [this.InfoValue.ProjectDetailString,[Validators.required]],
      EmployeeRequireString: [this.InfoValue.EmployeeRequireString],
      EmployeeWriteString: [this.InfoValue.EmployeeWriteString, [Validators.required]],
      GroupMisString: [this.InfoValue.GroupMisString, [Validators.required]],
      AttachFile: [this.InfoValue.AttachFile],
      RemoveAttach: [this.InfoValue.RemoveAttach],
    });
    this.InfoValueForm.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe(data => this.onValueChanged(data));

    if (this.InfoValueForm) {
      Object.keys(this.InfoValueForm.controls).forEach(field => {
        const control = this.InfoValueForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  // On JobcardDetail
  OnDetailSelect(Item: { data?: JobcardDetail, option: number }) {
    if (this.denySave) {
      return;
    }

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
        } else { // Else New data
          detailInfoValue = {
            JobCardDetailId: 0,
            JobCardDetailStatus:JobcardDetailStatus.Wait
          };
        }

        this.serviceDialogs.dialogInfoJobCardDetail(this.viewContainerRef, detailInfoValue)
          .subscribe(jobCardDetail => {
            if (jobCardDetail) {
              if (this.indexItem > -1) {
                // remove item
                this.InfoValue.JobCardDetails.splice(this.indexItem, 1);
              }
              // Status jobcard detail
              jobCardDetail.StatusString = JobcardDetailStatus[jobCardDetail.JobCardDetailStatus];

              this.InfoValue.JobCardDetails.push(Object.assign({}, jobCardDetail));
              this.InfoValue.JobCardDetails = this.InfoValue.JobCardDetails.slice();
              // Update to form
              this.InfoValueForm.patchValue({
                JobCardDetails: this.InfoValue.JobCardDetails
              });
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
  // Open Dialog
  openDialog(type?: string): void {
    if (this.denySave) {
      return;
    }

    if (type) {
      if (type === "Employee" || type === "Employee2") {
        this.serviceDialogs.dialogSelectEmployee(this.viewContainerRef)
          .subscribe(emp => {
            if (emp) {
              if (type === "Employee") {
                this.InfoValueForm.patchValue({
                  EmpWrite: emp.EmpCode,
                  EmployeeWriteString: `คุณ${emp.NameThai}`,
                });

                this.serviceUser.getUserByEmpCode(emp.EmpCode)
                  .subscribe(user => {
                    if (user) {
                      if (user.MailAddress) {
                        this.InfoValueForm.patchValue({
                          MailReply: user.MailAddress
                        });
                      }
                    }
                  });

                this.getEmployeeGroupMisByEmpCode(emp.EmpCode);
              } else {
                this.InfoValueForm.patchValue({
                  EmpRequire: emp.EmpCode,
                  EmployeeRequireString: `คุณ${emp.NameThai}`,
                });
              }
           
            }
          });
      } else if (type === "Project") {
        this.serviceDialogs.dialogSelectProject(this.viewContainerRef, 2)
          .subscribe((project:ProjectMaster) => {
            if (project) {
              if (project.ProjectCodeSub) {
                this.InfoValueForm.patchValue({
                  ProjectCodeDetailId: project.ProjectCodeSub.ProjectCodeDetailId,
                  ProjectDetailString: `${project.ProjectCode}/${project.ProjectCodeSub.ProjectCodeDetailCode}`,
                });
              }
            }
          });
      } else if (type === "GroupMis") {
        this.serviceDialogs.dialogSelectGroupMis(this.viewContainerRef)
          .subscribe((group: EmployeeGroupMis) => {
            //debug here
            // console.log(JSON.stringify(group));
            this.InfoValueForm.patchValue({
              GroupCode: group ? group.GroupMIS : undefined,
              GroupMisString: group ? `${group.GroupDesc}` : undefined,
            });
          });
      }
    }
  }
  // get employee group mis
  getEmployeeGroupMisByEmpCode(EmpCode: string): void {
    if (EmpCode) {
      this.serviceGroup.getGroupByEmpCode(EmpCode)
        .subscribe(Group => {
          if (Group) {
            this.InfoValue.GroupCode = Group.GroupCode;
            this.InfoValue.EmployeeRequireString = Group.Description;
            // Patch data to form
            this.InfoValueForm.patchValue({
              GroupCode: this.InfoValue.GroupCode,
              GroupMisString: this.InfoValue.EmployeeRequireString,
            });
          }
        })
    }
  }

  //////////////
  // Override //
  //////////////

  // on valid data
  onFormValid(isValid: boolean): void {
    if (isValid && !this.denySave) {
      // get raw value for formcontrol is disable
      this.InfoValue = this.InfoValueForm.getRawValue() as JobcardMaster;
      this.communicateService.toParent(this.InfoValue);
    }
  }

  ////////////
  // Module //
  ////////////
  // get attact file
  getAttach(): void {
    if (this.InfoValue && this.InfoValue.JobCardMasterId > 0) {
      this.service.getAttachFile(this.InfoValue.JobCardMasterId)
        .subscribe(dbAttach => {
          if (dbAttach) {
            this.attachFiles = dbAttach.slice();
          } else {
            this.attachFiles = new Array;
          }
        }, error => console.error(error));
    }
  }
  // on Attach Update List
  onUpdateAttachResults(results: FileList): void {
    // debug here
    // console.log("File: ", results);
    this.InfoValue.AttachFile = results;
    // debug here
    // console.log("Att File: ", this.RequirePaintList.AttachFile);

    this.InfoValueForm.patchValue({
      AttachFile: this.InfoValue.AttachFile
    });
  }
  // on Attach delete file
  onDeleteAttachFile(attach: AttachFile): void {
    if (attach) {
      if (!this.InfoValue.RemoveAttach) {
        this.InfoValue.RemoveAttach = new Array;
      }
      // remove
      this.InfoValue.RemoveAttach.push(attach.AttachFileId);
      // debug here
      // console.log("Remove :",this.InfoValue.RemoveAttach);

      this.InfoValueForm.patchValue({
        RemoveAttach: this.InfoValue.RemoveAttach
      });
      let template: Array<AttachFile> =
        this.attachFiles.filter((e: AttachFile) => e.AttachFileId !== attach.AttachFileId);

      this.attachFiles = new Array();
      setTimeout(() => this.attachFiles = template.slice(), 50);
    }
  }
  // open file attach
  onOpenNewLink(link: string): void {
    if (link) {
      window.open(link, "_blank");
    }
  }
}
