import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BaseScheduleComponent } from '../../shared/base-schedule.component';
import { CuttingPlanService } from '../shared/cutting-plan.service';
import { FormBuilder } from '@angular/forms';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { Scroll } from '../../shared/scroll.model';
import { ProjectMaster } from '../../projects/shared/project-master.model';
import { ColumnType } from '../../shared/my-colmun.model';
import { CuttingPlan } from '../shared/cutting-plan.model';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-cutting-plan-not-finish',
  templateUrl: './cutting-plan-not-finish.component.html',
  styleUrls: ['./cutting-plan-not-finish.component.scss']
})
export class CuttingPlanNotFinishComponent extends BaseScheduleComponent<any, CuttingPlanService> {

  constructor(
    service: CuttingPlanService,
    fb: FormBuilder,
    viewCon: ViewContainerRef,
    serviceDialog: DialogsService,
    private serviceAuth: AuthService,
  ) {
    super(service, fb, viewCon, serviceDialog);
  }

  onGetData(schedule: Scroll): void {
    this.service.postCuttingPlanNotFinish(schedule)
      .subscribe((dbData: any) => {
        if (!dbData) {
          this.totalRecords = 0;
          this.columns = new Array;
          this.datasource = new Array;
          this.reloadData();
          this.loading = false;
          return;
        }

        this.totalRecords = dbData.TotalRow || 0;
        // new Column Array
        let width125: number = 125;
        let width150: number = 150;

        this.columns = new Array;
        this.columns = [
          { field: 'JobNumber', header: 'JobNumber.', width: width150, },
        ];

        for (let name of dbData.Columns) {
          this.columns.push({
            header: name, field: name, width: width125, type: ColumnType.Option,
          });
        }

        this.datasource = dbData.DataTable.slice();
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
      }, () => this.loading = false);
  }

  onSelectRow(infoValue?: CuttingPlan): void {
    if (infoValue) {
      this.serviceDialogs.confirm("Confirm cancel cutting-plan",
        "Do you want cancel this cutting-plan.", this.viewCon)
        .subscribe(result => {
          if (result) {
            infoValue.Creator = this.serviceAuth.getAuth.UserName || "";
            this.service.postCloseCuttingPlanNotFinish(infoValue)
              .subscribe(result => {
                this.onGetData(this.scroll);
              });
          }
        });
    }
  }

  onShowDialog(type?: string): void {
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
      }
    }
  }

}
