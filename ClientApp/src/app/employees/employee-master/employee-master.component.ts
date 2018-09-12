import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { Employee } from '../shared/employee.model';
import { EmployeeService } from '../shared/employee.service';
import { EmployeeCommuncateService } from '../shared/employee-communcate.service';
import { AuthService } from '../../core/auth/auth.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { BaseMasterComponent } from '../../shared/base-master-component';
import { EmployeeTableComponent } from '../employee-table/employee-table.component';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.scss']
})
export class EmployeeMasterComponent extends BaseMasterComponent<Employee,EmployeeService,EmployeeCommuncateService> {

  constructor(
    service: EmployeeService,
    serviceCommuncate: EmployeeCommuncateService,
    serviceAuth: AuthService,
    serviceDialogs: DialogsService,
    viewContainerRef:ViewContainerRef
  ) {
    super(service, serviceCommuncate, serviceAuth, serviceDialogs, viewContainerRef);
  }

  //Parameter
  @ViewChild(EmployeeTableComponent)
  private tableComponent: EmployeeTableComponent;

  onReloadData(): void {
    this.tableComponent.reloadData();
  }

  onCheckStatus(infoValue?: Employee): boolean {
    return true;
  }
}
