import { Injectable } from '@angular/core';
import { BaseCommunicateService } from '../../shared/base-communicate.service';
import { NoTaskMachine } from './no-task-machine.model';


@Injectable()
export class NoTaskMachineCommunicateService extends BaseCommunicateService<NoTaskMachine> {
  constructor() { super(); }
}
