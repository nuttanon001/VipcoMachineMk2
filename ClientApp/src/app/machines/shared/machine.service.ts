import { Injectable } from '@angular/core';
import { BaseRestService } from '../../shared/base-rest.service';
import { Machine } from './machine.model';
import { HttpClient } from '@angular/common/http';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';

@Injectable()
export class MachineService extends BaseRestService<Machine> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/version2/Machine/",
      "MachineService",
      "MachineId",
      httpErrorHandler
    )
  }
}
