// Angular Cores
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// Modules
import { TaskMachineRoutingModule } from './task-machine-routing.module';
import { CustomMaterialModule } from '../shared/customer-material.module';
// Services
import { TaskMachineService } from './shared/task-machine.service';
import { EmployeeService } from '../employees/shared/employee.service';
import { TypeMachineService } from '../machines/shared/type-machine.service';
import { ProgressTaskMachineService } from './shared/progress-task-machine.service';
import { JobcardDetailService } from '../jobcard-masters/shared/jobcard-detail.service';
import { TaskMachineCommunicateService } from './shared/task-machine-communicate.service';
// Components
import { TaskMachineCenterComponent } from './task-machine-center.component';
import { TaskMachineInfoComponent } from './task-machine-info/task-machine-info.component';
import { TaskMachineTableComponent } from './task-machine-table/task-machine-table.component';
import { TaskMachineMasterComponent } from './task-machine-master/task-machine-master.component';
import { TaskMachineScheduleComponent } from './task-machine-schedule/task-machine-schedule.component';
import { TaskMachineProgressTableComponent } from './task-machine-progress-table/task-machine-progress-table.component';
import { StandardTimeService } from '../standard-times/shared/standard-time.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    TaskMachineRoutingModule,
  ],
  declarations: [
    TaskMachineInfoComponent,
    TaskMachineTableComponent,
    TaskMachineCenterComponent,
    TaskMachineMasterComponent,
    TaskMachineScheduleComponent,
    TaskMachineProgressTableComponent,
  ],
  providers: [
    EmployeeService,
    TypeMachineService,
    TaskMachineService,
    JobcardDetailService,
    ProgressTaskMachineService,
    TaskMachineCommunicateService,
    StandardTimeService,
  ]
})
export class TaskMachineModule { }
