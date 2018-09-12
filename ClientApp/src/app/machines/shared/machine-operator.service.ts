import { Injectable } from '@angular/core';
import { MachineOperator } from './machine-operator.model';
import { BaseRestService } from '../../shared/base-rest.service';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MachineOperatorService extends BaseRestService<MachineOperator> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/version2/MachineHasOperator/",
      "MachineHasOperatorsService",
      "MachineOperatorId",
      httpErrorHandler
    )
  }
}
