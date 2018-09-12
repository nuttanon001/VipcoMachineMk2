import { Component, OnInit, Input } from '@angular/core';
import { JobcardDetailTableComponent } from '../../../jobcard-masters/jobcard-detail-table/jobcard-detail-table.component';

@Component({
  selector: 'app-jobcard-master-table-extend',
  templateUrl: '../../../jobcard-masters/jobcard-detail-table/jobcard-detail-table.component.html',
  styleUrls: ['./jobcard-master-table-extend.component.scss']
})
export class JobcardMasterTableExtendComponent extends JobcardDetailTableComponent {
  constructor() {
    super();
  }

  @Input() optionEdit1: boolean = false;

  ngOnInit(): void  {
    this.optionEdit = this.optionEdit1;
    this.fastSelected = this.optionEdit1;
    super.ngOnInit();
  }
}
