import { Injectable } from '@angular/core';
import { JobcardDetail } from './jobcard-detail.model';
import { BaseRestService } from '../../shared/base-rest.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
import { AutoComplate } from '../../shared/auto-complate';
import { ResultAutoComplate } from '../../shared/result-auto-complate';
import { Observable } from "rxjs/observable";
import { catchError } from 'rxjs/operators';
import { JobcardSchedule } from './jobcard-schedule.model';
import { JobcardMaster } from './jobcard-master.model';
import { ChangeJobcardDetail } from './change-jobcard-detail.model';
//
@Injectable()
export class JobcardDetailService extends BaseRestService<JobcardDetail> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/version2/JobCardDetail/",
      "JobCardDetailService",
      "JobCardDetailId",
      httpErrorHandler
    )
  }

  /** get one with key number */
  getJobcardMasterByDetail(JobcardDetailId: number): Observable<JobcardMaster> {
    // Add safe, URL encoded search parameter if there is a search term
    const options = { params: new HttpParams().set("key", JobcardDetailId.toString()) };
    return this.http.get<JobcardMaster>(this.baseUrl + "GetJobMasterByJobDetail/", options)
      .pipe(catchError(this.handleError("Get job master with job detail", <JobcardMaster>{})));
  }
  
  /**
  * postCancelJobCardDetail
  * @param jobCardDetail
  */
  postSplitJobCardDetail(jobCardDetail: JobcardDetail): Observable<JobcardDetail> {
    return this.http.post<any>(this.baseUrl + "SplitJobCardDetail/", JSON.stringify(jobCardDetail), {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    }).pipe(catchError(this.handleError("Split jobcard detail from api", <JobcardDetail>{})));
  }

  /**
   * postCancelJobCardDetail
   * @param jobCardDetail
   */
  postCancelJobCardDetail(jobCardDetail: JobcardDetail): Observable<any> {
    return this.http.post<any>(this.baseUrl + "CancelJobCardDetail/", JSON.stringify(jobCardDetail), {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    }).pipe(catchError(this.handleError("Cancel jobcard detail from api",{})));
  }

  /**
   * postRequireScheduleOnlyGmCm
   * @param schedule
   */
  postRequireScheduleOnlyGmCm(schedule:JobcardSchedule): Observable<any> {
    return this.http.post<any>(this.baseUrl + "RequireJobCardDetalScheduleOnlyGmCm/", JSON.stringify(schedule), {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    }).pipe(catchError(this.handleError("Get require machine from api", {})));
  }

  /**
   * postChangeJobCardDetailGroup
   * @param changeJobCard
   */
  postChangeJobCardDetailGroup(changeJobCard: ChangeJobcardDetail): Observable<JobcardMaster> {
    return this.http.post<any>(this.baseUrl + "ChangeJobCardDetailGroup/", JSON.stringify(changeJobCard), {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    }).pipe(catchError(this.handleError("Get require machine from api", <JobcardMaster>{})));
  }


  // ===================== Quality Control Welder Auto Complate ===========================\\
  // Master Project auto complate
  getAutoComplateEdition(autoComplate: AutoComplate): Observable<Array<ResultAutoComplate>> {
    return this.http.post<Array<ResultAutoComplate>>(
      this.baseUrl + "Autocomplate/",
      JSON.stringify(autoComplate),
      {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        })
      }).pipe(catchError(this.handleError("Get autocomplate from api", Array<ResultAutoComplate>())));
  }

}
