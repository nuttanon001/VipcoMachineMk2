import { Injectable } from '@angular/core';
import { BaseCommunicateService } from '../../shared/base-communicate.service';
import { JobcardMaster } from './jobcard-master.model';

@Injectable()
export class JobcardMasterCommuncateService extends BaseCommunicateService<JobcardMaster> {
  constructor() { super(); }
}
