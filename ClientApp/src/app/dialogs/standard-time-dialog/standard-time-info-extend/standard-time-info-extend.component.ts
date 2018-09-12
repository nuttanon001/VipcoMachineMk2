import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { StandardTimeInfoComponent } from '../../../standard-times/standard-time-info/standard-time-info.component';
import { StandardTimeService } from '../../../standard-times/shared/standard-time.service';
import { StandardTimeCommuncateService } from '../../../standard-times/shared/standard-time-communcate.service';
import { DialogsService } from '../../shared/dialogs.service';
import { TypeStandardTimeService } from '../../../standard-times/shared/type-standard-time.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-standard-time-info-extend',
  templateUrl: '../../../standard-times/standard-time-info/standard-time-info.component.html',
  styleUrls: ['./standard-time-info-extend.component.scss']
})
export class StandardTimeInfoExtendComponent extends StandardTimeInfoComponent {
  constructor(
    service: StandardTimeService,
    serviceCom: StandardTimeCommuncateService,
    serviceTypeStd: TypeStandardTimeService,
    serviceDialog: DialogsService,
    viewCon: ViewContainerRef,
    fb: FormBuilder
  ) {
    super(service, serviceCom, serviceTypeStd, fb, serviceDialog, viewCon);
  }
}
