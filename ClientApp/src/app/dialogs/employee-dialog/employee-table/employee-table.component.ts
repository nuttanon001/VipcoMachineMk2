// Angular Core
import { Component } from "@angular/core";
// Components
import { BaseTableComponent } from "../../../shared/base-table.component";
// Models
import { Employee } from "../../../employees/shared/employee.model";
// Services
import { EmployeeService } from "../../../employees/shared/employee.service";
import { AuthService } from "../../../core/auth/auth.service";

@Component({
  selector: "dialog-employee-table",
  templateUrl: "./employee-table.component.html",
  styleUrls: ["./employee-table.component.scss"]
})
export class EmployeeTableComponent extends BaseTableComponent<Employee, EmployeeService>{
  // Constructor
  constructor(
    service: EmployeeService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns = ["select", "EmpCode", "NameThai", "GroupName"];
    this.isDialog = true;
  }
}
