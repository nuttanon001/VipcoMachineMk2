import { Injectable } from '@angular/core';
import { BaseRestService } from '../../shared/base-rest.service';
import { JobcardMaster } from './jobcard-master.model';
import { HttpClient, HttpParams, HttpHeaders, HttpRequest, HttpEventType } from '@angular/common/http';
import { HttpErrorHandler } from '../../shared/http-error-handler.service';
import { Observable } from "rxjs/observable";
import { AttachFile } from '../../shared/attach-file.model';
import { catchError } from 'rxjs/operators';
import { JobcardSchedule } from './jobcard-schedule.model';

@Injectable()
export class JobcardMasterService extends BaseRestService<JobcardMaster> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/version2/JobCardMaster/",
      "JobCardMasterService",
      "JobCardMasterId",
      httpErrorHandler
    )
  }
  
  // Cutting Plan to JobCardDetail
  getCheckCuttingPlanWaiting(): Observable<any> {
    let url: string = `${this.baseUrl}CheckCuttingPlanWaiting/`;
    return this.http.get<any>(url).pipe(catchError(this.handleError("Check cutting plan from api")));
  }
  /**
 * GetWaitJobCardScheduleOnlyLmSm
 * @param schedule
 */
  getWaitJobCardScheduleOnlyLmSm(schedule: JobcardSchedule): Observable<any> {
    return this.http.post<any>(this.baseUrl + "GetWaitJobCardScheduleOnlyLmSm/", JSON.stringify(schedule), {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    }).pipe(catchError(this.handleError("Get require machine from api", {})));
  }

  // ===================== Upload File ===============================\\
  // get file
  getAttachFile(JobCardMasterId: number): Observable<Array<AttachFile>> {
    return this.http.get<Array<AttachFile>>(this.baseUrl + "GetAttach/",
      { params: new HttpParams().set("key", JobCardMasterId.toString()) })
      .pipe(catchError(this.handleError("Get attach file from api.", Array<AttachFile>())));
  }

  // upload file
  postAttactFile(JobCardMasterId: number, files: FileList, CreateBy: string): Observable<any> {
    console.log(files);

    let input2: any = new FormData();
    for (let i: number = 0; i < files.length; i++) {
      if (files[i].size <= 5242880) {
        console.log(files[i]);
        input2.append("input2", files[i]);
      }
    }
    return this.http.post<any>(`${this.baseUrl}PostAttach/`, input2,
      { params: new HttpParams().set("key", JobCardMasterId.toString()).set("CreateBy", CreateBy) })
      .pipe(catchError(this.handleError("Upload attach file to api", <any>{})));
  }

  postAttactFile2(JobCardMasterId: number, files: FileList, CreateBy: string): Observable<any> {
    if (files.length === 0)
      return;

    const formData = new FormData();

    for (let i: number = 0; i < files.length; i++) {
      if (files[i].size <= 5242880) {
        formData.append("files", files[i]);
      }
    }

    const uploadReq = new HttpRequest('POST', `${this.baseUrl}PostAttach2/`, formData, {
      params: new HttpParams().set("key", JobCardMasterId.toString()).set("CreateBy", CreateBy),
      reportProgress: true,
    });

    this.http.request(uploadReq).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        console.log(Math.round(100 * event.loaded / event.total));
      } else if (event.type === HttpEventType.Response) {
        console.log(event.body.toString());
      }
    });
  }

  // delete file
  deleteAttactFile(AttachId: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + "DeleteAttach/",
      { params: new HttpParams().set("AttachFileId", AttachId.toString()) })
      .pipe(catchError(this.handleError("Delete attach file from api", <any>{})));
  }

  // ===================== End Upload File ===========================\\
}
