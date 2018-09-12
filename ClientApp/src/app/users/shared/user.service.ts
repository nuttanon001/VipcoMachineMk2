import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
// services
import { HttpErrorHandler } from "../../shared/http-error-handler.service";
// models
import { User } from "./user.model";
// Base-Service
import { BaseRestService } from "../../shared/base-rest.service";
// rxjs
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class UserService extends BaseRestService<User> {
  constructor(
    http: HttpClient,
    httpErrorHandler: HttpErrorHandler
  ) {
    super(
      http,
      "api/User/",
      "UserService",
      "UserId",
      httpErrorHandler
    )
  }

  // EmployeeAlready
  // get check employee already username
  getEmployeeAlready(empCode: string): Observable<any> {
    // Add safe, URL encoded search parameter if there is a search term
    const options = empCode ? { params: new HttpParams().set('EmpCode', empCode) } : {};

    let url: string = `${this.baseUrl}EmployeeAlready/`;

    // console.log("getEmployeeAlready", url);

    return this.http.get<any>(url, options)
      .pipe(catchError(this.handleError(this.serviceName + "/get by employee already", false)));
  }
  //GetUserByEmpCode
  getUserByEmpCode(empCode: string): Observable<User> {
    // Add safe, URL encoded search parameter if there is a search term
    const options = empCode ? { params: new HttpParams().set('EmpCode', empCode) } : {};
    let url: string = `${this.baseUrl}GetUserByEmpCode/`;
    return this.http.get<any>(url, options)
      .pipe(catchError(this.handleError(this.serviceName + "/get user by employee code", false)));
  }
}
