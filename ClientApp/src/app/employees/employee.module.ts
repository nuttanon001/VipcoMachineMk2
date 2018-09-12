import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// Modules
import { EmployeeRoutingModule } from './employee-routing.module';
import { CustomMaterialModule } from '../shared/customer-material.module';
// Services
import { EmployeeService } from './shared/employee.service';
import { EmployeeCommuncateService } from './shared/employee-communcate.service';
import { EmployeeGroupMisService } from './shared/employee-group-mis.service';
// Components
import { EmployeeCenterComponent } from './employee-center.component';
import { EmployeeTableComponent } from './employee-table/employee-table.component';
import { EmployeeMasterComponent } from './employee-master/employee-master.component';
import { EmployeeInfoComponent } from './employee-info/employee-info.component';
import { EmployeeGroupService } from './shared/employee-group.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    EmployeeRoutingModule
  ],
  declarations: [
    EmployeeCenterComponent,
    EmployeeTableComponent,
    EmployeeMasterComponent,
    EmployeeInfoComponent],
  providers: [
    EmployeeService,
    EmployeeGroupMisService,
    EmployeeCommuncateService,
    EmployeeGroupService
  ],
})
export class EmployeeModule { }
