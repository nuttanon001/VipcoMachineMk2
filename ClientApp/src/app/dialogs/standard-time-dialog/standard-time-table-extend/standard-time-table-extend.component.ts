import { Component, OnInit } from '@angular/core';
import { StandardTimeTableComponent } from '../../../standard-times/standard-time-table/standard-time-table.component';
import { StandardTimeService } from '../../../standard-times/shared/standard-time.service';
import { AuthService } from '../../../core/auth/auth.service';
import { TypeStandardTimeService } from '../../../standard-times/shared/type-standard-time.service';

@Component({
  selector: 'app-standard-time-table-extend',
  templateUrl: '../../../standard-times/standard-time-table/standard-time-table.component.html',
  styleUrls: ['./standard-time-table-extend.component.scss']
})
export class StandardTimeTableExtendComponent extends StandardTimeTableComponent {
  constructor(
    service: StandardTimeService,
    serviceTypeStandard: TypeStandardTimeService,
    serviceAuth: AuthService,
  ) {
    super(service, serviceAuth, serviceTypeStandard);
  }
}
