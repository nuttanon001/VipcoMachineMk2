// Angular Core
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
// Models
import { JobcardSchedule } from '../shared/jobcard-schedule.model';
import { TypeMachine } from '../../machines/shared/type-machine.model';
// Rxjs
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
// Services
import { JobcardMasterService } from '../shared/jobcard-master.service';
import { JobcardDetailService } from '../shared/jobcard-detail.service';
import { TypeMachineService } from '../../machines/shared/type-machine.service';
import { Observable } from 'rxjs/Observable';
// 3rd patry
import { Column, SelectItem, LazyLoadEvent } from "primeng/primeng";
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { ProjectSub } from '../../projects/shared/project-sub.model';
import { JobcardDetail } from '../shared/jobcard-detail.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MyColumn, ColumnType } from '../../shared/my-colmun.model';
import { ShareService } from '../../shared/share.service';

@Component({
  selector: 'app-jobcard-master-waiting',
  templateUrl: './jobcard-master-waiting.component.html',
  styleUrls: ['./jobcard-master-waiting.component.scss']
})
export class JobcardMasterWaitingComponent implements OnInit, OnDestroy {

  constructor(
    private service: JobcardDetailService,
    private serviceShare: ShareService,
    private serviceMaster: JobcardMasterService,
    private serviceTypeMachine: TypeMachineService,
    private serviceDialogs: DialogsService,
    private serviceAuth:AuthService,
    private fb: FormBuilder,
    private viewContainerRef: ViewContainerRef,
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  // Parameter
  // other
  subscription: Subscription;
  // time
  message: number = 0;
  count: number = 0;
  time: number = 300;
  totalRecords: number;
  // form
  schedule: JobcardSchedule;
  reportForm: FormGroup;
  // table
  columns: Array<MyColumn>;
  datasource: Array<any>;
  pageRow: number = 15;
  // type machine
  typeMachines: Array<TypeMachine>;
  first: number = 0;
  loadReport: boolean;
  loading: boolean;
  needReset: boolean = false;
  tableWidth: string = "98vw";
  rowGroupMetadata: any;

  // initial
  ngOnInit() {
    let schedule = this.serviceShare.getSharedDateNotObservable as JobcardSchedule;
    if (schedule) {
      this.schedule = schedule;
      this.first = schedule.Skip;
      this.pageRow = schedule.Take;
      this.serviceShare.setShearedDataNotObservable = undefined;
    }

    this.getTypeMachine();
    this.buildForm();
    // Check Cutting plan waiting
    // this.serviceMaster.getCheckCuttingPlanWaiting().subscribe();
  }

  // destroy
  ngOnDestroy(): void {
    if (this.subscription) {
      // prevent memory leak when component destroyed
      this.subscription.unsubscribe();
    }
  }

  // build form
  buildForm(): void {
    if (!this.schedule) {
      this.schedule = {};
    }

    this.reportForm = this.fb.group({
      Filter: [this.schedule.Filter],
      TypeMachineId: [this.schedule.TypeMachineId],
      ProjectMasterId: [this.schedule.ProjectMasterId],
      ProjectDetailId: [this.schedule.ProjectDetailId],
      FullProjectString: [this.schedule.FullProjectString],
      Skip: [this.schedule.Skip],
      Take: [this.schedule.Take],
    });
    this.reportForm.valueChanges.pipe(debounceTime(250),distinctUntilChanged())
      .subscribe((data: any) => this.onValueChanged(data));
  }

  //get type machine
  getTypeMachine(): void {
    if (!this.typeMachines) {
      this.typeMachines = new Array;
      this.serviceTypeMachine.getAll()
        .subscribe((dbData: Array<TypeMachine>) => {
          this.typeMachines = dbData.filter(item => item.TypeMachineCode === "GM" || item.TypeMachineCode === "CM").slice();
        });
    }
  }
   
  // on value change
  onValueChanged(data?: any): void {
    if (!this.reportForm) { return; }
    this.schedule = this.reportForm.value;
    this.onGetData(this.schedule);
  }

  // get request data
  onGetData(schedule: JobcardSchedule): void {
    this.serviceMaster.getCheckCuttingPlanWaiting().subscribe(result => {
      this.service.postRequireScheduleOnlyGmCm(schedule)
        .subscribe(dbDataSchedule => {
          if (!dbDataSchedule) {
            this.totalRecords = 0;
            this.columns = new Array;
            this.datasource = new Array;
            this.reloadData();
            return;
          }
          this.totalRecords = dbDataSchedule.TotalRow;
          // new Column Array
          this.columns = new Array;
          // Width
          let Width100: number = 100;
          let Width125: number = 125;
          let Width150: number = 150;
          // column Row1
          this.columns = [
            { header: "JobNumber", field: "JobNumber", width: Width125 },
            // { header: "GroupMachine", field: "GroupMachine", width: Width100 },
          ]

          for (let name of dbDataSchedule.Columns) {
            this.columns.push({
              header: name, field: name, width: Width125, type: ColumnType.Option,
            });
          }
          //console.log("ColumnDb", JSON.stringify(dbDataSchedule.Columns));
          //console.log("Column", JSON.stringify(this.columns));
          //console.log("Data is", JSON.stringify(dbDataSchedule.DataTable));
          this.datasource = dbDataSchedule.DataTable.slice();
          this.updateRowGroupMetaData();
          if (this.needReset) {
            this.first = 0;
            this.needReset = false;
          }
          this.reloadData();
        }, error => {
          this.totalRecords = 0;
          this.columns = new Array;
          this.datasource = new Array;
          this.reloadData();
        });
    });
  }

  // reload data
  reloadData(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = Observable.interval(1000)
      .take(this.time).map((x) => x + 1)
      .subscribe((x) => {
        this.message = this.time - x;
        this.count = (x / this.time) * 100;
        if (x === this.time) {
          if (this.reportForm.value) {
            this.onGetData(this.reportForm.value);
          }
        }
      });
  }

  // open dialog
  openDialog(type?: string): void {
    if (type) {
      if (type === "Project") {
        this.serviceDialogs.dialogSelectProject(this.viewContainerRef, 2)
          .subscribe((project: ProjectSub) => {
            this.needReset = false;
            this.reportForm.patchValue({
              ProjectId: project ? project.ProjectCodeDetailId : undefined,
              ProjectString: project ? `${project.FullProjectLevelString}`: undefined,
            });
          });
      }
    }
  }

  // reset
  resetFilter(): void {
    this.datasource = new Array;
    this.schedule = {};
    this.buildForm();
    this.onGetData(this.schedule);
  }

  // load Data Lazy
  loadDataLazy(event: LazyLoadEvent): void {
    // in a real application, make a remote request to load data using state metadata from event
    // event.first = First row offset
    // event.rows = Number of rows per page
    // event.sortField = Field name to sort with
    // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    // filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    // imitate db connection over a network
    this.first = event.first;

    this.reportForm.patchValue({
      Skip: event.first,
      Take: (event.rows || 15),
    });
  }

  // on selected data
  onSelectRow(infoValue?: JobcardDetail): void {
    if (infoValue) {
      // Template schedule filter
      const scheduleData = this.reportForm.getRawValue() as JobcardSchedule;
      this.serviceShare.setShearedDataNotObservable = scheduleData;

      this.serviceDialogs.dialogSelectRequireMachine(infoValue, this.viewContainerRef, true)
        .subscribe(condition => {
          if (condition === 1) {
            this.router.navigate(["task-machine/", infoValue.JobCardDetailId]);
          } else if (condition == 2) {
            this.serviceDialogs.dialogChangeMachinesGroup(this.viewContainerRef)
              .subscribe(typeMachine => {
                if (typeMachine) {
                  this.service.postChangeJobCardDetailGroup({
                    ChangeBy: this.serviceAuth.getAuth.UserName,
                    JobcardDetailId: infoValue.JobCardDetailId,
                    TypeMachineId: typeMachine.TypeMachineId
                  }).subscribe(jobMaster => {
                    if (jobMaster) {
                      this.serviceDialogs.context("System Message", "Change machine task complate.", this.viewContainerRef)
                        .subscribe();
                      this.onGetData(this.schedule);
                    }
                  });
                }
              });
          } else if (condition === 3) {
            this.router.navigate(["notask-machine/", infoValue.JobCardDetailId]);
          } else if (condition === 4) {
            this.service.getOneKeyNumber({ JobCardDetailId: infoValue.JobCardDetailId })
              .subscribe(dbData => {
                dbData.ReadOnly = true;
                this.serviceDialogs.dialogInfoJobCardDetail(this.viewContainerRef, dbData, true)
                  .subscribe(result => {
                    if (result) {
                      this.needReset = true;
                      if (result.SplitQuality && result.SplitQuality > 0) {
                        // console.log(JSON.stringify(result));

                        result.Creator = this.serviceAuth.getAuth.UserName || "";
                        this.service.postSplitJobCardDetail(result)
                          .subscribe(splitJobDetail => {
                            this.needReset = false;
                            this.router.navigate(["task-machine/", splitJobDetail.JobCardDetailId]);
                          });
                      }
                    }
                  });
              });
            // console.log(JSON.stringify(infoValue));
          } else if (condition === -1) {
            if (this.serviceAuth.getAuth.LevelUser < 3) {
              this.serviceDialogs.error("Access Deny", "Access is restricted. please contact administrator !!!", this.viewContainerRef)
                .subscribe();
            } else {
              this.serviceDialogs.confirmMessage("Question Message", "Do you want to cancel requrie quality control?", this.viewContainerRef)
                .subscribe(result => {
                  if (result.result) {
                    infoValue.Remark = result.message;
                    infoValue.Modifyer = this.serviceAuth.getAuth.UserName;
                    this.service.postCancelJobCardDetail(infoValue)
                      .subscribe(result => {
                        this.onGetData(this.schedule);
                      });
                  }
                });
            }
          }
        });
      //this.serviceDialogs.dialogSelectRequireQualityControl(master.RequireQualityControlId, this.viewContainerRef)
      //  .subscribe(conditionNumber => {
      //    if (conditionNumber) {
      //      if (conditionNumber === -1) {
      //        this.onUpdateRequireMaintenance(master.RequireQualityControlId);
      //        setTimeout(() => { this.onGetData(this.reportForm.value); }, 750);
      //      } else if (conditionNumber === 2) {
      //        setTimeout(() => { this.onGetData(this.reportForm.value); }, 750);
      //      } else if (conditionNumber === 1) {
      //        this.router.navigate(["qualitycontrol/", master.RequireQualityControlId]);
      //      } else if (conditionNumber === 3) {
      //        this.RequireQualityControlId = master.RequireQualityControlId;
      //        this.loadReport = !this.loadReport;
      //      } else if (conditionNumber === -2) {
      //        this.serviceDialogs.confirmMessage("Question Message", "Do you want to cancel requrie quality control?",
      //          this.viewContainerRef).subscribe(result => {
      //            if (result) {
      //              if (result.result) {
      //                this.service.cancelRequireQualityControl(
      //                  {
      //                    RemarkCancel: result.message,
      //                    RequireQualityControlId: master.RequireQualityControlId,
      //                    ByUser: this.serviceAuth.getAuth.UserName,
      //                    EmployeeName: this.serviceAuth.getAuth.NameThai,
      //                  })
      //                  .subscribe(dbData => {
      //                    setTimeout(() => { this.onGetData(this.reportForm.value); }, 750);
      //                  });
      //              }
      //            }
      //          });
      //      }
      //    }
      //  });
    }
  }

  // RequireMaintenance Has Action
  onChangeMachineGroup(RequireQcId: number): void {
    //this.service.actionRequireQualityControl(RequireQcId, (this.serviceAuth.getAuth.UserName || ""))
    //  .subscribe();
  }

  // on back from report
  onBack(): void {
    this.loadReport = !this.loadReport;
  }

  // update
  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.datasource) {
      for (let i = 0; i < this.datasource.length; i++) {
        let rowData = this.datasource[i];
        let groupMachine = rowData.GroupMachine;
        if (i == 0) {
          this.rowGroupMetadata[groupMachine] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.datasource[i - 1];
          let previousRowGroup = previousRowData.GroupMachine;
          if (groupMachine === previousRowGroup)
            this.rowGroupMetadata[groupMachine].size++;
          else
            this.rowGroupMetadata[groupMachine] = { index: i, size: 1 };
        }
      }
    }
  }
}
