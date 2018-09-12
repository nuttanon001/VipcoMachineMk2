import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// Modules
import { CustomMaterialModule } from '../shared/customer-material.module';
import { NoTaskMachineRoutingModule } from './no-task-machine-routing.module';
// Services
import { NoTaskMachineService } from './shared/no-task-machine.service';
import { JobcardDetailService } from '../jobcard-masters/shared/jobcard-detail.service';
import { JobcardMasterService } from '../jobcard-masters/shared/jobcard-master.service';
import { NoTaskMachineCommunicateService } from './shared/no-task-machine-communicate.service';
// Components
import { NoTaskCenterComponent } from './no-task-center.component';
import { NoTaskInfoComponent } from '../no-task-machines/no-task-info/no-task-info.component';
import { NoTaskTableComponent } from '../no-task-machines/no-task-table/no-task-table.component';
import { NoTaskMasterComponent } from '../no-task-machines/no-task-master/no-task-master.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    NoTaskMachineRoutingModule
  ],
  declarations: [
    NoTaskCenterComponent,
    NoTaskMasterComponent,
    NoTaskInfoComponent,
    NoTaskTableComponent
  ],
  providers: [
    NoTaskMachineService,
    NoTaskMachineCommunicateService,
    JobcardDetailService,
    JobcardMasterService,
  ]
})
export class NoTaskMachineModule { }
