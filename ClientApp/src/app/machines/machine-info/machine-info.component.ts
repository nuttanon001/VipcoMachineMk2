// AngularCore
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
// Rxjs
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
// Services
import { MachineService } from '../shared/machine.service';
import { TypeMachineService } from '../shared/type-machine.service';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
import { MachineOperatorService } from '../shared/machine-operator.service';
import { MachineCommuncateService } from '../shared/machine-communcate.service';
// Components
import { BaseInfoComponent } from '../../shared/base-info-component';
// Models
import { Machine } from '../shared/machine.model';
import { TypeMachine } from '../shared/type-machine.model';
import { MachineOperator } from '../shared/machine-operator.model';

@Component({
  selector: 'app-machine-info',
  templateUrl: './machine-info.component.html',
  styleUrls: ['./machine-info.component.scss']
})
export class MachineInfoComponent extends BaseInfoComponent<Machine,MachineService,MachineCommuncateService> {
  constructor(
    service: MachineService,
    serviceCom: MachineCommuncateService,
    private serviceOperator: MachineOperatorService,
    private serviceTypeMachine:TypeMachineService,
    private serviceDialogs: DialogsService,
    private viewContainerRef: ViewContainerRef,
    private fb:FormBuilder
  ) {
    super(service, serviceCom);
  }
  // Parameter
  @ViewChild("ImageFile") ImageFile;
  indexItem: number;
  typeMachines: Array<TypeMachine>;
  //On get data from api
  onGetDataByKey(InfoValue?: Machine): void {
    if (InfoValue) {
      this.service.getOneKeyNumber(InfoValue)
        .subscribe(dbData => {
          this.InfoValue = dbData;
          if (this.InfoValue) {
            this.serviceOperator.getByMasterId(this.InfoValue.MachineId)
              .subscribe(dbDetail => {
                this.InfoValue.MachineHasOperators = new Array;
                if (dbDetail) {
                  dbDetail.forEach(item => {
                    this.InfoValue.MachineHasOperators.push(Object.assign({}, item));
                  });

                  this.InfoValueForm.patchValue({
                    MachineHasOperators: this.InfoValue.MachineHasOperators
                  });
                }
              });
          }
        }, error => console.error(error), () => this.buildForm());
    } else {
      this.InfoValue = { MachineId: 0, MachineHasOperators: new Array };
      this.buildForm();
    }
  }
  //BulidForm
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
      MachineId: [this.InfoValue.MachineId],
      MachineCode: [this.InfoValue.MachineCode,
        [
          Validators.required,
          Validators.maxLength(50)
        ]
      ],
      MachineName: [this.InfoValue.MachineName,
        [
          Validators.required,
          Validators.maxLength(200),
        ]
      ],
      InstalledDate: [this.InfoValue.InstalledDate],
      Model: [this.InfoValue.Model],
      Brand: [this.InfoValue.Brand],
      MachineImageString: [this.InfoValue.MachineImageString],
      Remark: [this.InfoValue.Remark],
      MachineStatus: [this.InfoValue.MachineStatus],
      // BaseModel
      Creator: [this.InfoValue.Creator],
      CreateDate: [this.InfoValue.CreateDate],
      Modifyer: [this.InfoValue.Modifyer],
      ModifyDate: [this.InfoValue.ModifyDate],
      //FK
      TypeMachineId: [this.InfoValue.TypeMachineId],
      MachineHasOperators: [this.InfoValue.MachineHasOperators],
    });
    this.InfoValueForm.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe(data => this.onValueChanged(data));
  }
  // On MachineOperator
  OnDetailSelect(Item: { data?: MachineOperator, option: number }) {
    if (Item) {
      if (!Item.data) {
        this.indexItem = -1;
      } else {
        this.indexItem = this.InfoValue.MachineHasOperators.indexOf(Item.data);
      }

      if (Item.option === 1) {
        this.serviceDialogs.dialogSelectEmployees(this.viewContainerRef)
          .subscribe(employees => {
            if (employees) {
              employees.forEach((item, index) => {
                if (!this.InfoValue.MachineHasOperators.find(itemEmp => itemEmp.EmpCode === item.EmpCode)) {
                  this.InfoValue.MachineHasOperators.push({
                    MachineOperatorId: 0,
                    MachineId: this.InfoValue.MachineId,
                    EmpCode: item.EmpCode,
                    EmployeeString: item.NameThai,
                  });
                }
              });

              this.InfoValue.MachineHasOperators = this.InfoValue.MachineHasOperators.slice();
              // Update to form
              this.InfoValueForm.patchValue({
                MachineHasOperators: this.InfoValue.MachineHasOperators
              });
            }
          });
      }
      else if (Item.option === 0) // Remove
      {
        this.InfoValue.MachineHasOperators.splice(this.indexItem, 1);
        this.InfoValue.MachineHasOperators = this.InfoValue.MachineHasOperators.slice();
        // Update to form
        this.InfoValueForm.patchValue({
          MachineHasOperators: this.InfoValue.MachineHasOperators
        });
      }
    }
  }
  // File Image
  onFileUploadChange($event): void {
    let file = $event.dataTransfer ? $event.dataTransfer.files[0] : $event.target.files[0];
    let pattern = /image/;
    if (!file.type.match(pattern)) {
      this.ImageFile.nativeElement.value = "";
      this.serviceDialogs.error("ไม่เข้าเงื่อนไข", "ระบบบันทึกเฉพาะไฟล์รูปภาพเท่านั้น !!!", this.viewContainerRef)
      return;
    } else {
      this.readImageFileToString64($event.target);
    }
  }
  // Read image
  readImageFileToString64(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.InfoValueForm.patchValue({ MachineImageString: myReader.result });
    }
    myReader.readAsDataURL(file);
  }
}
