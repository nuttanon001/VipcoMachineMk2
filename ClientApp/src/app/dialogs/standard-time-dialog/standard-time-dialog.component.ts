import { Component, OnInit, Inject } from '@angular/core';
import { StandardTime } from '../../standard-times/shared/standard-time.model';
import { StandardTimeCommuncateService } from '../../standard-times/shared/standard-time-communcate.service';
import { StandardTimeService } from '../../standard-times/shared/standard-time.service';
import { TypeStandardTimeService } from '../../standard-times/shared/type-standard-time.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BaseMasterDialogComponent } from '../../shared/base-master-dialog.component';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-standard-time-dialog',
  templateUrl: './standard-time-dialog.component.html',
  styleUrls: ['./standard-time-dialog.component.scss'],
  providers: [
    StandardTimeService,
    StandardTimeCommuncateService,
    TypeStandardTimeService,
  ]
})
export class StandardTimeDialogComponent extends BaseMasterDialogComponent
<StandardTime, StandardTimeService, StandardTimeCommuncateService> {
  constructor(
    service: StandardTimeService,
    serviceCom: StandardTimeCommuncateService,
    serviceAuth: AuthService,
    dialogRef: MatDialogRef<StandardTimeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public mode: number
  ) {
    super(service, serviceCom, serviceAuth, dialogRef);
  }
  canEdit: boolean = false;
  // on init
  onInit(): void {
    this.fastSelectd = this.mode === 0;
  }
}
