import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { BaseMasterComponent } from '../../shared/base-master-component';
import { Machine } from '../shared/machine.model';
import { MachineService } from '../shared/machine.service';
import { MachineCommuncateService } from '../shared/machine-communcate.service';
import { AuthService } from '../../core/auth/auth.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { MachineTableComponent } from '../machine-table/machine-table.component';

@Component({
  selector: 'app-machine-master',
  templateUrl: './machine-master.component.html',
  styleUrls: ['./machine-master.component.scss']
})
export class MachineMasterComponent extends BaseMasterComponent<Machine,MachineService,MachineCommuncateService> {
  constructor(
    service: MachineService,
    serviceCom: MachineCommuncateService,
    serviceAuth: AuthService,
    serviceDia: DialogsService,
    viewConRef:ViewContainerRef
  ) { super(service, serviceCom, serviceAuth, serviceDia, viewConRef); }

  @ViewChild(MachineTableComponent)
  private tableComponent: MachineTableComponent;

  onReloadData(): void {
    this.tableComponent.reloadData();
  }

  onCheckStatus(infoValue?: Machine): boolean {
    return true;
  }
}
