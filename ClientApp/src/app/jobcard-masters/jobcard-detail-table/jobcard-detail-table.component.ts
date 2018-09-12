import { Component, OnInit, Input } from '@angular/core';
import { BaseTableFontData } from '../../shared/base-table-fontdata.component';
import { JobcardDetail } from '../shared/jobcard-detail.model';

@Component({
  selector: 'app-jobcard-detail-table',
  templateUrl: './jobcard-detail-table.component.html',
  styleUrls: ['./jobcard-detail-table.component.scss']
})
export class JobcardDetailTableComponent extends BaseTableFontData<JobcardDetail> {

  constructor() {
    super();
    this.displayedColumns = ["CuttingPlanString", "Material", "StandardTimeString","StatusString", "Quality", "Command"];
  }

  optionEdit: boolean = false;
}

