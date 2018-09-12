import { Injectable } from '@angular/core';
import { TaskMachine } from './task-machine.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
import { BaseRestService } from '../../shared/base-rest.service';
import { JobcardSchedule } from '../../jobcard-masters/shared/jobcard-schedule.model';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { Scroll } from '../../shared/scroll.model';
import { OptionChart } from './option-chart.model';
import { Http } from '@angular/http';

@Injectable()
export class TaskMachineService extends BaseRestService<TaskMachine> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/version2/TaskMachine/",
      "TaskMachineService",
      "TaskMachineId",
      httpErrorHandler
    )
  }

  // ===================== Task Machine Chart ===========================\\
  // get task machine chart data
  postTaskMachineChartData(option: OptionChart, subAction: string = "TaskMachineChartDataProduct/"): Observable<any> {
    return this.http.post(`${this.baseUrl}${subAction}`, JSON.stringify(option), {
      headers: new HttpHeaders({ "Content-Type": "application/json"})
    }).pipe(catchError(this.handleError("Get chart task machine from api", {})));
  }

  // Task machine schedule
  postTaskMachineSchedule(schedule: Scroll): Observable<any> {
    return this.http.post<any>(this.baseUrl + "TaskMachineSchedule/", JSON.stringify(schedule), {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    }).pipe(catchError(this.handleError("Get task machine schedule from api", {})));
  }

  // get Task Machine Number
  getTaskMachinePaper(taskMachineId: number): Observable<any> {
    let url: string = this.baseUrl + "GetReportTaskMachine/" + taskMachineId + "/";
    // console.log(url);
    return this.http.get(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }),
      responseType: 'blob' // <-- changed to blob 
    }).map(res => downloadFile(res, 'application/xlsx', 'export.xlsx'));
  }
}


export function downloadFile(blob: any, type: string, filename: string): string {
  const url = window.URL.createObjectURL(blob); // <-- work with blob directly

  // create hidden dom element (so it works in all browsers)
  const a = document.createElement('a');
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);

  // create file, attach to hidden element and open hidden element
  a.href = url;
  a.download = filename;
  a.click();
  return url;
}
