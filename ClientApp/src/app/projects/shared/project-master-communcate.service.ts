import { Injectable } from '@angular/core';
import { BaseCommunicateService } from '../../shared/base-communicate.service';
import { ProjectMaster } from './project-master.model';

@Injectable()
export class ProjectMasterCommuncateService extends BaseCommunicateService<ProjectMaster> {
  constructor() { super(); }
}
