import { Component, OnInit } from '@angular/core';
import { BaseTableFontData } from '../../shared/base-table-fontdata.component';
import { ProjectSub } from '../shared/project-sub.model';

@Component({
  selector: 'app-project-sub-table',
  templateUrl: './project-sub-table.component.html',
  styleUrls: ['./project-sub-table.component.scss']
})
export class ProjectSubTableComponent extends BaseTableFontData<ProjectSub> {

  constructor() {
    super();
    this.displayedColumns = ["ProjectCodeDetailCode", "Description", "Command"];
  }
}
