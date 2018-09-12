import { Component, OnInit } from '@angular/core';
import { BaseTableComponent } from '../../../shared/base-table.component';
import { TypeStandardTime } from '../../../standard-times/shared/type-standard-time.model';
import { TypeStandardTimeService } from '../../../standard-times/shared/type-standard-time.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-type-standardtime-table',
  templateUrl: './type-standardtime-table.component.html',
  styleUrls: ['./type-standardtime-table.component.scss']
})
export class TypeStandardtimeTableComponent extends BaseTableComponent<TypeStandardTime, TypeStandardTimeService>{
  // Constructor
  constructor(
    service: TypeStandardTimeService,
    authService: AuthService,
  ) {
    super(service, authService);
    this.displayedColumns = ["select", "Name", "TypeMachineString"];
  }
}
