// Angular Core
import { Component } from "@angular/core";
// Components
import { BaseTableComponent } from "../../../shared/base-table.component";
// Models
import { EmployeeGroupMis } from "../../../employees/shared/employee-group-mis.model";
// Services
import { EmployeeGroupMisService } from "../../../employees/shared/employee-group-mis.service";
import { AuthService } from "../../../core/auth/auth.service";

@Component({
  selector: "dialog-groupmis-table",
  templateUrl: "./groupmis-table.component.html",
  styleUrls: ["./groupmis-table.component.scss"]
})

export class GroupmisTableComponent extends BaseTableComponent<EmployeeGroupMis, EmployeeGroupMisService>{
  // Constructor
  constructor(
    service: EmployeeGroupMisService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns = ["select", "GroupMIS", "GroupDesc"];
    this.isDialog = true;
  }
}
