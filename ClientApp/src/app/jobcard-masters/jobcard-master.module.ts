// Angular Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// Modules
import { CustomMaterialModule } from '../shared/customer-material.module';
import { JobcardMasterRoutingModule } from './jobcard-master-routing.module';
// Services
import { EmployeeService } from '../employees/shared/employee.service';
import { JobcardMasterService } from './shared/jobcard-master.service';
import { JobcardDetailService } from './shared/jobcard-detail.service';
import { TypeMachineService } from '../machines/shared/type-machine.service';
import { EmployeeGroupService } from '../employees/shared/employee-group.service';
import { EmployeeGroupMisService } from '../employees/shared/employee-group-mis.service';
import { JobcardMasterCommuncateService } from './shared/jobcard-master-communcate.service';
// Components
import { JobcardMasterCenterComponent } from './jobcard-master-center.component';
import { JobcardMasterComponent } from './jobcard-master/jobcard-master.component';
import { JobcardMasterInfoComponent } from './jobcard-master-info/jobcard-master-info.component';
import { JobcardMasterTableComponent } from './jobcard-master-table/jobcard-master-table.component';
import { JobcardDetailTableComponent } from './jobcard-detail-table/jobcard-detail-table.component';
import { JobcardMasterWaitingComponent } from './jobcard-master-waiting/jobcard-master-waiting.component';
import { JobcardMasterWaitingLmsmComponent } from './jobcard-master-waiting-lmsm/jobcard-master-waiting-lmsm.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    JobcardMasterRoutingModule
  ],
  declarations: [
    JobcardMasterComponent,
    JobcardMasterInfoComponent,
    JobcardMasterTableComponent,
    JobcardDetailTableComponent,
    JobcardMasterCenterComponent,
    JobcardMasterWaitingComponent,
    JobcardMasterWaitingLmsmComponent,
  ],
  providers: [
    EmployeeService,
    TypeMachineService,
    JobcardDetailService,
    JobcardMasterService,
    EmployeeGroupService,
    EmployeeGroupMisService,
    JobcardMasterCommuncateService,
  ]
})
export class JobcardMasterModule { }
