import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BaseInfoComponent } from '../../shared/base-info-component';
import { Employee } from '../shared/employee.model';
import { EmployeeService } from '../shared/employee.service';
import { EmployeeCommuncateService } from '../shared/employee-communcate.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogsService } from '../../dialogs/shared/dialogs.service';
//rxjs
import { debounceTime,distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss']
})
export class EmployeeInfoComponent extends BaseInfoComponent<Employee,EmployeeService,EmployeeCommuncateService> {

  constructor(
    service: EmployeeService,
    serviceCommuncate: EmployeeCommuncateService,
    private fb: FormBuilder,
    private serviceDialogs: DialogsService,
    private viewContainerRef:ViewContainerRef
  ) { super(service, serviceCommuncate); }

  //On get data from api
  onGetDataByKey(InfoValue?: Employee): void {
    if (InfoValue) {
      this.service.getOneKeyString(InfoValue)
        .subscribe(dbData => {
          this.InfoValue = dbData;
        }, error => console.error(error), () => this.buildForm());
    } else {
      this.InfoValue = {EmpCode : "xxxxx"};
      this.buildForm();
    }
  }
  //BulidForm
  buildForm(): void {
    this.InfoValueForm = this.fb.group({
      EmpCode: [this.InfoValue.EmpCode,
        [
          Validators.required,
          Validators.maxLength(50)
        ]
      ],
      Title: [this.InfoValue.Title,
        [
          Validators.required,
        ]
      ],
      NameThai: [this.InfoValue.NameThai,
        [
          Validators.required,
          Validators.maxLength(100),
        ]
      ],
      NameEng: [this.InfoValue.NameEng,
        [
          Validators.maxLength(100),
        ]
      ],
      TypeEmployee: [this.InfoValue.TypeEmployee,
        [
          Validators.required,
        ]
      ],
      GroupCode: [this.InfoValue.GroupCode,
        [
          Validators.required,
        ]
      ],
      GroupName: [this.InfoValue.GroupName],
      GroupMIS: [this.InfoValue.GroupMIS,
        [
          Validators.required,
        ]
      ],
      TypeEmployeeString: [this.InfoValue.TypeEmployeeString],
    });
    this.InfoValueForm.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe(data => this.onValueChanged(data));
  }
  //OpenDialog
  openDialog(type: string = ""): void {
    if (type) {
      if (type.indexOf("GroupMis") !== -1) {
        this.serviceDialogs.dialogSelectGroupMis(this.viewContainerRef)
          .subscribe(groupMis => {
            this.InfoValueForm.patchValue({
              GroupCode: groupMis ? groupMis.GroupMIS : undefined,
              GroupMIS: groupMis ? groupMis.GroupMIS : undefined,
              GroupName: groupMis ? groupMis.GroupDesc : undefined
            });
          });
      }
    }
  }
}
