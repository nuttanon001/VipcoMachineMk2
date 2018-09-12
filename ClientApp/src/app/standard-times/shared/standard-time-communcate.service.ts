import { Injectable } from '@angular/core';
import { BaseCommunicateService } from '../../shared/base-communicate.service';
import { StandardTime } from './standard-time.model';

@Injectable()
export class StandardTimeCommuncateService extends BaseCommunicateService<StandardTime> {
  constructor() { super(); }
}
