// angular
import { Component, Inject, ViewChild, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
// models
// service
// rxjs
import { Observable, Subscription } from "rxjs";
// base-component
import { BaseDialogComponent } from "../../shared/base-dialog.component";
import { EmployeeGroupService } from "../../employees/shared/employee-group.service";
import { EmployeeGroup } from "../../employees/shared/employee-group.model";

@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.scss'],
  providers: [EmployeeGroupService]
})
export class GroupDialogComponent extends BaseDialogComponent<EmployeeGroup, EmployeeGroupService> {
  /** employee-dialog ctor */
  constructor(
    public service: EmployeeGroupService,
    public dialogRef: MatDialogRef<GroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public mode: number
  ) {
    super(
      service,
      dialogRef
    );
  }
  // on init
  onInit(): void {
    this.fastSelectd = this.mode === 0 ? true : false;
  }
}
