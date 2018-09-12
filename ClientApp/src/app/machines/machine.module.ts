// Angular Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// Modules
import { MachineRoutingModule } from './machine-routing.module';
import { CustomMaterialModule } from '../shared/customer-material.module';
// Components
import { MachineCenterComponent } from './machine-center.component';
import { MachineInfoComponent } from './machine-info/machine-info.component';
import { MachineTableComponent } from './machine-table/machine-table.component';
import { MachineMasterComponent } from './machine-master/machine-master.component';
import { MachineOperatorTableComponent } from './machine-operator-table/machine-operator-table.component';
// Services
import { MachineService } from './shared/machine.service';
import { TypeMachineService } from './shared/type-machine.service';
import { MachineOperatorService } from './shared/machine-operator.service';
import { MachineCommuncateService } from './shared/machine-communcate.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    MachineRoutingModule
  ],
  declarations: [
    MachineInfoComponent,
    MachineTableComponent,
    MachineMasterComponent,
    MachineCenterComponent,
    MachineOperatorTableComponent,
  ],
  providers: [
    MachineService,
    TypeMachineService,
    MachineOperatorService,
    MachineCommuncateService,
  ]
})
export class MachineModule { }
