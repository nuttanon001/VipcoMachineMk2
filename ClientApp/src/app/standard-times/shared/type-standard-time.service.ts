import { Injectable } from '@angular/core';
import { BaseRestService } from '../../shared/base-rest.service';
import { TypeStandardTime } from './type-standard-time.model';
import { HttpClient } from '@angular/common/http';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';

@Injectable()
export class TypeStandardTimeService extends BaseRestService<TypeStandardTime> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/version2/TypeStandardTime/",
      "TypeStandardTimeService",
      "TypeStandardTimeId",
      httpErrorHandler
    )
  }
}
