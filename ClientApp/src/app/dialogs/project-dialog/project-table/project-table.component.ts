// Angular Core
import { Component } from "@angular/core";
// Components
import { BaseTableComponent } from "../../../shared/base-table.component";
// Models
import { ProjectMaster } from "../../../projects/shared/project-master.model";
// Services
import { ProjectMasterService } from "../../../projects/shared/project-master.service";
import { AuthService } from "../../../core/auth/auth.service";

@Component({
  selector: "dialog-project-table",
  templateUrl: "./project-table.component.html",
  styleUrls: ["./project-table.component.scss"]
})
export class ProjectTableComponent extends BaseTableComponent<ProjectMaster, ProjectMasterService>{
  // Constructor
  constructor(
    service: ProjectMasterService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns = ["select", "ProjectCode", "ProjectName"];
    this.isDialog = true;
  }
}

