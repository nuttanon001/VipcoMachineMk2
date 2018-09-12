import { Injectable } from '@angular/core';
// import { Workgroup } from "../work-groups/shared/workgroup.model";
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ShareService {
  private sharingData = new Subject<any>();
  setData : any;
  constructor() {
    //this.WorkGroup = {
    //  WorkGroupId: 1
    //};
  }

  get getSharedDateNotObservable(): any {
    // console.log("Get sheare", JSON.stringify(this.setData));
    return this.setData;
  }

  set setShearedDataNotObservable(_setData:any) {
    this.setData = _setData;
    // console.log("Set sheare", JSON.stringify(this.setData));
  }

  // Get SharedData
  getSharedData(): Observable<any> {
    return this.sharingData.asObservable();
  }
  // Set WorkGroup
  setSharedData(_shardData: any): void {
    this.sharingData.next(_shardData);
  }
}
