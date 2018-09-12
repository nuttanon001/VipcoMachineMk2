import { Injectable } from '@angular/core';
import { BaseRestService } from '../../shared/base-rest.service';
import { StandardTime } from './standard-time.model';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StandardTimeService extends BaseRestService<StandardTime> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/version2/StandardTime/",
      "StandardTimeService",
      "StandardTimeId",
      httpErrorHandler
    )
  }
}
