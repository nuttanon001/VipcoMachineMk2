// Angular Core
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, ViewContainerRef, Input, OnChanges } from '@angular/core';
// Components
import { BaseScheduleComponent } from '../../shared/base-schedule.component';
// Models
import { Scroll } from '../../shared/scroll.model';
import { ColumnType } from '../../shared/my-colmun.model';
import { ScheduleMode } from '../shared/schedule-mode.model';
import { Machine } from '../../machines/shared/machine.model';
import { ScheduleStatus } from '../shared/schedule-status.enum';
import { TypeMachine } from '../../machines/shared/type-machine.model';
import { ProjectMaster } from '../../projects/shared/project-master.model';
// Services
import { TaskMachineService } from '../shared/task-machine.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { TypeMachineService } from '../../machines/shared/type-machine.service';
import { AuthService } from '../../core/auth/auth.service';
import { ShareService } from '../../shared/share.service';

@Component({
  selector: 'app-task-machine-schedule',
  templateUrl: './task-machine-schedule.component.html',
  styleUrls: ['./task-machine-schedule.component.scss']
})

export class TaskMachineScheduleComponent extends BaseScheduleComponent<any,TaskMachineService> implements OnChanges {
  constructor(
    service: TaskMachineService,
    fb: FormBuilder,
    viewCon: ViewContainerRef,
    serviceDialog: DialogsService,
    private serviceTypeMachine: TypeMachineService,
    private serviceShare: ShareService,
    private route: ActivatedRoute,
    private router: Router,
    private serviceAuth:AuthService,
  ) {
      super(service,fb,viewCon,serviceDialog);
  }

  //Param
  mode: number;
  typeMachines: Array<TypeMachine>;
  @Input() showCommand: boolean = true;
  @Input() scheduleMode: ScheduleMode | undefined;
  @Input() tableWidth: string = "98vw";

  // on init
  ngOnInit(): void {
    let scroll = this.serviceShare.getSharedDateNotObservable as Scroll;
    if (scroll) {
      // console.log("Load template",JSON.stringify(scroll));
      this.scroll = scroll;
      this.first = scroll.Skip;
      this.pageRow = scroll.Take;
    }


    this.onGetTypeMachines();
    if (this.scheduleMode) {
      this.scroll = {
        WhereId: this.scheduleMode.MachineId,
        SDate: this.scheduleMode.PickDate,
        WhereId2: this.scheduleMode.TypeMachineId,
        WhereId5: this.scheduleMode.Mode,
      };
    }
    super.ngOnInit();


    this.route.paramMap.subscribe((param: ParamMap) => {
      this.mode = Number(param.get("mode") || 0);
      let OptionString = "";
      let Where5 = "";
      if (this.mode && this.reportForm) {
        let schedule = ScheduleStatus.WaitAndProgress;
        if (this.mode === 2) {
          schedule = ScheduleStatus.Complate;
        } else if (this.mode === 3) {
          schedule = ScheduleStatus.All;
          if (this.serviceAuth.getAuth) {
            OptionString = this.serviceAuth.getAuth.NameThai;
            Where5 = this.serviceAuth.getAuth.EmpCode;
          }
        }
        this.reportForm.patchValue({
          ScheduleStatus: schedule,
          OptionString: OptionString,
          Where5: Where5
        });
      }
    }, error => console.error(error));

    this.route.paramMap.subscribe((param: ParamMap) => {
      let taskMachineId = Number(param.get("taskid"));
      if (taskMachineId) {
        this.mode = 3;
        this.showCommand = false;
        this.reportForm.patchValue({
          ScheduleStatus: ScheduleStatus.All,
          WhereId4: taskMachineId
        });
      }
    }, error => console.error(error));

    // console.log("ngOnInit");
  }

  // on change
  ngOnChanges(): void {
    if (this.scheduleMode && this.reportForm) {
      this.reportForm.patchValue({
        WhereId: this.scheduleMode.MachineId,
        SDate: this.scheduleMode.PickDate,
        WhereId2: this.scheduleMode.TypeMachineId,
        WhereId5: this.scheduleMode.Mode,
      });
      // debug here
      // console.log(JSON.stringify(this.scroll));
      // this.onValueChanged();

      // console.log("ngOnChanges");
    }
  }

  // On get data from api
  onGetData(schedule: Scroll): void {
    this.loading = true;
    this.service.postTaskMachineSchedule(schedule)
      .subscribe((dbData: any) => {

        if (!dbData) {
          // console.log("no data");
          this.totalRecords = 0;
          this.columns = new Array;
          this.columnLowers = new Array;
          this.columnUppers = new Array;
          this.datasource = new Array;
          this.loading = false;
          this.needReset = false;

          this.reloadData();
          return;
        }

        // console.log("data");

        this.totalRecords = dbData.TotalRow || 0;
        // new Column Array
        let width55: number = 65;
        let width100: number = 100;
        let width150: number = 150;
        let width250: number = 250;
        let width350: number = 350;
        this.columnUppers = new Array;
        this.columnUppers = [
          { header: "MachineNo", rowspan: 2, width: width150 },
          { header: "JobNo", rowspan: 2, width: width250 },
          { header: "CuttingPlan/ShopDrawing | Mat'l | UnitNo", rowspan: 2, width: width350 },
          { header: "Weight", rowspan: 2, width: width100 },
          { header: "Std(Plan/Act)", rowspan: 2, width: width150 },
          { header: "Qty", rowspan: 2, width: width55 },
          { header: "Pro", rowspan: 2, width: width55 },
          { header: "Progress", rowspan: 2, width: width100 }
        ];

        for (let month of dbData.ColumnUppers) {
          this.columnUppers.push({
            header: month.Name,
            colspan: month.Value,
            width: (month.Value * 35)
          });
        }

        this.columnLowers = new Array;

        for (let name of dbData.ColumnLowers) {
          this.columnLowers.push({
            header: name,
            width: 35
          });
        }

        this.columns = new Array;
        this.columns = [
          { field: 'MachineNo', header: 'MachineNo.', width: width150, },
          { field: 'JobNo', header: 'JobNo.', width: width150, },
          { field: 'Description', header: "CuttingPlan/ShopDrawing | Mat'l | UnitNo", width: width350, type: (this.mode !== 3 ? ColumnType.Click : undefined) },
          { field: 'Weight', header: 'Weight', width: width100, },
          { field: 'StandardTime', header: "Std", width: width150 },
          { field: 'CurrentQuantity', header: 'Qty', width: width55, },
          { field: 'TotalQuantity', header: 'Pro', width: width55, },
          { field: 'Progress', header: 'Progress', width: width100, },
        ];

        let i: number = 0;
        for (let name of dbData.Columns) {
          if (name.indexOf("Col") >= -1) {
            this.columns.push({
              header: this.columnLowers[i].header, field: name, width: 35, type: ColumnType.Option,
            });
            i++;
          }
        }

        this.datasource = dbData.DataTable.slice();
        if (this.needReset) {
          this.needReset = false;
        }

        // this.reloadData();

        // console.log("end");

      }, error => {
        this.totalRecords = 0;
        this.columns = new Array;
        this.datasource = new Array;
        this.reloadData();
      }, () => this.loading = false);
  }

  // On get type machine from api
  onGetTypeMachines(): void {
    if (!this.typeMachines) {
      this.typeMachines = new Array;
    }

    this.serviceTypeMachine.getAll()
      .subscribe((dbData: Array<TypeMachine>) => {
        if (dbData) {
          this.typeMachines = dbData.slice();
        }
      });
  }

  // On show dialog
  onShowDialog(type:string): void {
    if (type) {
      if (type.indexOf('Project') !== -1) {
        this.serviceDialogs.dialogSelectProject(this.viewCon, 2)
          .subscribe((project: ProjectMaster) => {
            if (project) {
              if (project.ProjectCodeSub) {
                this.needReset = true;
                this.reportForm.patchValue({
                  WhereId3: project.ProjectCodeSub.ProjectCodeDetailId,
                  Where3: `${project.ProjectCode}/${project.ProjectCodeSub.ProjectCodeDetailCode}`,
                });
              }
            }
          });
      } else if (type.indexOf('Machine') !== -1) {
        this.serviceDialogs.dialogSelectMachines(this.viewCon, { mode: 0, TypeMachineId: 0 })
          .subscribe((machine: Machine) => {
            this.needReset = true;
            this.reportForm.patchValue({
              WhereId: machine ? machine.MachineId : undefined,
              Where: machine ? `${machine.MachineCode}/${machine.MachineName}` : undefined,
            });
          });
      }
    }
  }

  // On Click task machine
  onClickTaskMachine(data:any): void {
    if (data && this.mode !== 3) {
      // Template Scroll
      const scroll = this.reportForm.getRawValue() as Scroll;
      this.serviceShare.setShearedDataNotObservable = undefined;
      this.serviceShare.setShearedDataNotObservable = scroll;

      if (data.TaskMachineId && data.JobCardDetailId) {
        this.router.navigate(["task-machine/progress", { taskid: data.TaskMachineId, jobid: data.JobCardDetailId}]);
      }
    }
  }
}
