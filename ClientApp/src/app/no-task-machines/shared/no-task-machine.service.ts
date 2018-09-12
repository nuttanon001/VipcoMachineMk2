import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
import { BaseRestService } from '../../shared/base-rest.service';
import { NoTaskMachine } from './no-task-machine.model';

@Injectable()
export class NoTaskMachineService extends BaseRestService<NoTaskMachine> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/version2/NoTaskMachine/",
      "NoTaskMachineService",
      "NoTaskMachineId",
      httpErrorHandler
    )
  }
}
