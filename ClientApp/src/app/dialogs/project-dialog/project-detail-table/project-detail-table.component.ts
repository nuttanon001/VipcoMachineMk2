// Angular Core
import { Component } from "@angular/core";
// Components
import { BaseTableFontData } from '../../../shared/base-table-fontdata.component';
// Model
import { ProjectSub } from "../../../projects/shared/project-sub.model";

@Component({
  selector: 'dialog-project-detail-table',
  templateUrl: './project-detail-table.component.html',
  styleUrls: ['./project-detail-table.component.scss']
})
export class ProjectDetailTableComponent extends BaseTableFontData<ProjectSub> {
  /** custom-mat-table ctor */
  constructor() {
    super();
    this.displayedColumns = ["select", "ProjectCodeDetailCode", "Description", "edit"];
  }
}

