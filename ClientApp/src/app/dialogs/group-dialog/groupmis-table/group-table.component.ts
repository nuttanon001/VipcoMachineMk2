// Angular Core
import { Component } from "@angular/core";
// Components
import { BaseTableComponent } from "../../../shared/base-table.component";
// Models
import { EmployeeGroupMis } from "../../../employees/shared/employee-group-mis.model";
// Services
import { EmployeeGroupMisService } from "../../../employees/shared/employee-group-mis.service";
import { AuthService } from "../../../core/auth/auth.service";
import { EmployeeGroup } from "../../../employees/shared/employee-group.model";
import { EmployeeGroupService } from "../../../employees/shared/employee-group.service";

@Component({
  selector: "dialog-group-table",
  templateUrl: "./group-table.component.html",
  styleUrls: ["./group-table.component.scss"]
})

export class GroupTableComponent extends BaseTableComponent<EmployeeGroup, EmployeeGroupService>{
  // Constructor
  constructor(
    service: EmployeeGroupService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns = ["select", "GroupCode", "Description"];
    this.isDialog = true;
  }
}
