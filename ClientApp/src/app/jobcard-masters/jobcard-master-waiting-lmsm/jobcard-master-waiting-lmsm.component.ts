// Angular Core
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, ViewContainerRef, OnDestroy } from '@angular/core';
// Models
import { LazyLoadEvent } from 'primeng/primeng';
import { JobcardMaster } from '../shared/jobcard-master.model';
import { JobcardSchedule } from '../shared/jobcard-schedule.model';
import { MyColumn, ColumnType } from '../../shared/my-colmun.model';
import { ProjectSub } from '../../projects/shared/project-sub.model';
import { TypeMachine } from '../../machines/shared/type-machine.model';
// Services
import { AuthService } from '../../core/auth/auth.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { JobcardMasterService } from '../shared/jobcard-master.service';
import { JobcardDetailService } from '../shared/jobcard-detail.service';
import { TypeMachineService } from '../../machines/shared/type-machine.service';
// Rxjs
import { Subscription, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-jobcard-master-waiting-lmsm',
  templateUrl: './jobcard-master-waiting-lmsm.component.html',
  styleUrls: ['./jobcard-master-waiting-lmsm.component.scss']
})
export class JobcardMasterWaitingLmsmComponent implements OnInit, OnDestroy {
  constructor(
    private service: JobcardMasterService,
    private serviceJobDetail: JobcardDetailService,
    private serviceTypeMachine: TypeMachineService,
    private serviceDialogs: DialogsService,
    private serviceAuth: AuthService,
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
  rowGroupMetadata: any;
  // type machine
  typeMachines: Array<TypeMachine>;
  first: number = 0;
  loadReport: boolean;
  loading: boolean;
  needReset: boolean = false;
  tableWidth: string = "98vw";

  // initial
  ngOnInit() {
    this.getTypeMachine();
    this.buildForm();
  }

  // destroy
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // build form
  buildForm(): void {
    this.schedule = {};
    this.reportForm = this.fb.group({
      Filter: [this.schedule.Filter],
      TypeMachineId: [this.schedule.TypeMachineId],
      ProjectMasterId: [this.schedule.ProjectMasterId],
      ProjectDetailId: [this.schedule.ProjectDetailId],
      FullProjectString: [this.schedule.FullProjectString],
      Skip: [this.schedule.Skip],
      Take: [this.schedule.Take],
    });

    this.reportForm.valueChanges.pipe(debounceTime(250), distinctUntilChanged())
      .subscribe((data: any) => this.onValueChanged(data));
  }

  //get type machine
  getTypeMachine(): void {
    if (!this.typeMachines) {
      this.typeMachines = new Array;
      this.serviceTypeMachine.getAll()
        .subscribe((dbData: Array<TypeMachine>) => {
          this.typeMachines = dbData.filter(item => item.TypeMachineCode === "LM" || item.TypeMachineCode === "SM").slice();
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
    this.service.getWaitJobCardScheduleOnlyLmSm(schedule)
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
        let Width150: number = 200;
        // column Row1

        this.columns = [
          // { header: "GroupMachine", field: "GroupMachine", width: Width100 },
          { header: "JobNumber", field: "JobNumber", width: Width150 },
          { header: "Employee", field: "Employee", width: Width150 },
        ];

        for (let name of dbDataSchedule.Columns) {
          this.columns.push({
            header: name, field: name, width: Width150, type: ColumnType.Option,
          });
        }
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
            if (project) {
              this.needReset = false;
              this.reportForm.patchValue({
                ProjectId: project.ProjectCodeDetailId,
                ProjectString: `${project.FullProjectLevelString}`,
              });
            }
          });
      }
    }
  }

  // reset
  resetFilter(): void {
    this.datasource = new Array;
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
      SortField: event.sortField,
      SortOrder: event.sortOrder,
    });
  }

  // on selected data
  onSelectRow(infoValue?: JobcardMaster): void {
    if (infoValue) {
      this.serviceDialogs.dialogSelectRequireMachineLmSm(infoValue, this.viewContainerRef, true)
        .subscribe(jobcardDetail => {
          if (jobcardDetail) {
            if (jobcardDetail.JobCardDetailId > 0) {
              this.router.navigate(["task-machine/", jobcardDetail.JobCardDetailId]);
            } else if (jobcardDetail.JobCardDetailId === -1) {
              if (this.serviceAuth.getAuth.LevelUser < 2) {
                this.serviceDialogs.error("Access Deny", "Access is restricted. please contact administrator !!!", this.viewContainerRef)
                  .subscribe();
              } else {
                this.serviceDialogs.confirmMessage("Question Message", "Do you want to cancel requrie machine job ?", this.viewContainerRef)
                  .subscribe(result => {
                    if (result.result) {
                      infoValue.Remark = result.message;
                      infoValue.Modifyer = this.serviceAuth.getAuth.UserName;
                      this.service.cancelJobCardOnlyLmSm(infoValue)
                        .subscribe(result => {
                          this.onGetData(this.schedule);
                        });
                    }
                  });
              }
            } else {
              jobcardDetail.Creator = this.serviceAuth.getAuth.UserName || "";
              this.serviceJobDetail.addModel(jobcardDetail)
                .subscribe(dbData => {
                  this.router.navigate(["task-machine/", dbData.JobCardDetailId]);
                });
            }
            // this.serviceDialogs.context("", JSON.stringify(jobcardDetail), this.viewContainerRef).subscribe();
          }
        });
    }
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
