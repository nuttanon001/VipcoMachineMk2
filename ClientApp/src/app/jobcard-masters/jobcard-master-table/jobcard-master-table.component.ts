import { Component, OnInit } from '@angular/core';
import { JobcardMaster } from '../shared/jobcard-master.model';
import { JobcardMasterService } from '../shared/jobcard-master.service';
import { AuthService } from '../../core/auth/auth.service';
import { BaseTableComponent } from '../../shared/base-table.component';

@Component({
  selector: 'app-jobcard-master-table',
  templateUrl: './jobcard-master-table.component.html',
  styleUrls: ['./jobcard-master-table.component.scss']
})
export class JobcardMasterTableComponent extends BaseTableComponent<JobcardMaster,JobcardMasterService> {

  constructor(service: JobcardMasterService,serviceAuth:AuthService) {
    super(service, serviceAuth);
    this.displayedColumns = ["select", "JobCardMasterNo", "ProjectDetailString", "EmployeeRequireString", "TypeMachineString", "StatusString", "JobCardDate"];
    this.isDisabled = false;
  }
}
