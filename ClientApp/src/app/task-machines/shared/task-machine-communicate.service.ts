import { Injectable } from '@angular/core';
import { TaskMachine } from './task-machine.model';
import { BaseCommunicateService } from '../../shared/base-communicate.service';

@Injectable()
export class TaskMachineCommunicateService extends BaseCommunicateService<TaskMachine> {
  constructor() { super(); }
}
