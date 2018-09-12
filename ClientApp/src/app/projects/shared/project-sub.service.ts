import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
// service
import { HttpErrorHandler } from "../../shared/http-error-handler.service";
// models
import { ProjectSub } from "./project-sub.model";
// component
import { BaseRestService } from "../../shared/base-rest.service";

@Injectable()
export class ProjectSubService extends BaseRestService<ProjectSub> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/version2/ProjectCodeDetail/",
      "ProjectSubService",
      "ProjectCodeDetailId",
      httpErrorHandler
    )
  }

  // ===================== Project Code Detail ===========================\\
  // Project code detail
  //projectCodeDetailByMasterId(ProjectMasterId: number): Observable<Array<ProjectSub>> {
  //  const options = {
  //    params: new HttpParams().set("MasterId", ProjectMasterId.toString())
  //  };

  //  return this.http.get<Array<ProjectSub>>(this.baseUrl + "GetByMaster/", options)
  //    .pipe(catchError(this.handleError(this.serviceName + "/project detail service", Array<ProjectSub>())));
  //}
}
