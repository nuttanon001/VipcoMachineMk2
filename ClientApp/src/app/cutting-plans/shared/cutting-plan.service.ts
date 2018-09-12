import { Injectable } from '@angular/core';
import { BaseRestService } from '../../shared/base-rest.service';
//
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
// Model
import { CuttingPlan } from './cutting-plan.model';
import { CuttingPlanImport } from './cutting-plan-import.model';
// rxjs
import { Observable } from "rxjs";
import { catchError, retry, tap } from "rxjs/operators";
import { Scroll } from '../../shared/scroll.model';
import { Schedule } from 'primeng/primeng';

@Injectable()
export class CuttingPlanService extends BaseRestService<CuttingPlan> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/version2/CuttingPlan/",
      "CuttingPlanService",
      "CuttingPlanId",
      httpErrorHandler
    )
  }

  // get Check cutting-plan
  getCreateJobFromCuttingPlan(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}CheckCuttingPlan/`)
      .pipe(catchError(this.handleError("Check cutting plan", {})));
  }

  postCloseCuttingPlanNotFinish(cutting: CuttingPlan): Observable<any> {
    return this.http.post<any>(this.baseUrl + "CloseCuttingPlanNotFinish/", JSON.stringify(cutting),
      {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      }).pipe(catchError(this.handleError("Post close cutting plan not finish from api", {})));
  }

  // post cutting plan not finish
  postCuttingPlanNotFinish(schedule:Scroll): Observable<any> {
    return this.http.post<any>(this.baseUrl + "CuttingPlanNotFinish/", JSON.stringify(schedule),
    {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    }).pipe(catchError(this.handleError("Get cutting plan not finish from api", {})));
  }

  // port import Csv file
  postImportCsv(imports: Array<CuttingPlanImport>, UserName:string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}ImportData/`, JSON.stringify(imports),
    {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: new HttpParams().set("UserName", UserName)
    }).pipe(catchError(this.handleError("Import cutting plan model", {})));
  }
}
