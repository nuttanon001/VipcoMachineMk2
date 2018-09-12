import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// service
import { HttpErrorHandler } from "../../shared/http-error-handler.service";
// models
import { ProjectMaster } from "./project-master.model";
// component
import { BaseRestService } from "../../shared/base-rest.service";

@Injectable()
export class ProjectMasterService extends BaseRestService<ProjectMaster> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/version2/ProjectCodeMaster/",
      "ProjectMasterService",
      "ProjectCodeMasterId",
      httpErrorHandler
    )
  }
}
