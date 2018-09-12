import { Component, OnInit } from '@angular/core';
import { BaseInfoDialogComponent } from '../../../shared/base-info-dialog-component';
import { TypeStandardTime } from '../../../standard-times/shared/type-standard-time.model';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TypeMachine } from '../../../machines/shared/type-machine.model';
import { TypeMachineService } from '../../../machines/shared/type-machine.service';

@Component({
  selector: 'app-type-standardtime-info',
  templateUrl: './type-standardtime-info.component.html',
  styleUrls: ['./type-standardtime-info.component.scss']
})
export class TypeStandardtimeInfoComponent extends BaseInfoDialogComponent<TypeStandardTime> {

  constructor(
    private serviceTypeMachine: TypeMachineService,
    private fb: FormBuilder
  ) { super() }

  // Paramater
  typeMachines: Array<TypeMachine>;

  buildForm(): void {
    if (!this.typeMachines) {
      this.typeMachines = new Array();
      this.serviceTypeMachine.getAll()
        .subscribe(dbData => {
          if (dbData) {
            this.typeMachines = dbData.slice();
          }
        });
    }

    this.InfoValueForm = this.fb.group({
      TypeStandardTimeId: [this.InfoValue.TypeStandardTimeId],
      Name: [this.InfoValue.Name,
        [
          Validators.required,
          Validators.maxLength(50)
        ]
      ],
      TypeMachineString: [this.InfoValue.TypeMachineString],
      TypeMachineId: [this.InfoValue.TypeMachineId,[Validators.required]],
      //BaseMode
      CreateDate: [this.InfoValue.CreateDate],
      Creator: [this.InfoValue.Creator],
      ModifyDate: [this.InfoValue.ModifyDate],
      Modifyer: [this.InfoValue.Modifyer],
    });
  }
}
