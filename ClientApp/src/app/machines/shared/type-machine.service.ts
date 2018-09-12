import { Injectable } from '@angular/core';
import { BaseRestService } from '../../shared/base-rest.service';
import { TypeMachine } from './type-machine.model';
import { HttpClient } from '@angular/common/http';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';

@Injectable()
export class TypeMachineService extends BaseRestService<TypeMachine> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/version2/TypeMachine/",
      "TypeMachineService",
      "TypeMachineId",
      httpErrorHandler
    )
  }
}
