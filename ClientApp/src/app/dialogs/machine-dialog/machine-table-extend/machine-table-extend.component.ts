import { Component, OnInit, Input } from '@angular/core';
import { MachineTableComponent } from '../../../machines/machine-table/machine-table.component';
import { MachineService } from '../../../machines/shared/machine.service';
import { TypeMachineService } from '../../../machines/shared/type-machine.service';
import { AuthService } from '../../../core/auth/auth.service';
import { TypeMachine } from '../../../machines/shared/type-machine.model';

@Component({
  selector: 'app-machine-table-extend',
  templateUrl: '../../../machines/machine-table/machine-table.component.html',
  styleUrls: ['./machine-table-extend.component.scss']
})
export class MachineTableExtendComponent extends MachineTableComponent {

  constructor(
    service: MachineService,
    serviceType: TypeMachineService,
    serviceAuth: AuthService,
  ) {
    super(service, serviceAuth, serviceType);
  }

  @Input() TypeMachineId: number;

  ngOnInit(): void {
    if (!this.machineTypes) {
      this.machineTypes = new Array;
      this.serviceTypeMachine.getAll()
        .subscribe(dbData => {
          if (dbData) {
            if (this.TypeMachineId) {
              this.machineTypes = dbData.filter((item: TypeMachine) => item.TypeMachineId == this.TypeMachineId).slice();
              // console.log(JSON.stringify(this.machineTypes));
              this.selected = this.TypeMachineId;
            }
            super.ngOnInit();
          }
        });
    }
  }
}
