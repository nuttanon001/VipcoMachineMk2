import { Injectable } from '@angular/core';
import { ProgressTaskMachine } from './progress-task-machine.model';
import { BaseRestService } from '../../shared/base-rest.service';
import { HttpClient } from '@angular/common/http';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CurrentDate } from './current-date.model';

@Injectable()
export class ProgressTaskMachineService extends BaseRestService<ProgressTaskMachine> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/version2/ProgressTaskMachine/",
      "ProgressTaskMachineService",
      "ProgressId",
      httpErrorHandler
    )
  }

  // Current date from server
  getCurrentDate(): Observable<CurrentDate> {
    return this.http.get<any>(this.baseUrl + "CurrentDate/").pipe(catchError(this.handleError("Get current date from api", <CurrentDate>{})));
  }
}
