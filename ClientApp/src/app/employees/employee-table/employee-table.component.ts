import { Component, OnInit } from '@angular/core';
import { BaseTableComponent } from '../../shared/base-table.component';
import { Employee } from '../shared/employee.model';
import { EmployeeService } from '../shared/employee.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss']
})
export class EmployeeTableComponent extends BaseTableComponent<Employee,EmployeeService> {

  constructor(service: EmployeeService, serviceAuth: AuthService)
  {
    super(service, serviceAuth);
    this.displayedColumns = ["select", "EmpCode", "NameThai", "GroupName"];
  }
}
