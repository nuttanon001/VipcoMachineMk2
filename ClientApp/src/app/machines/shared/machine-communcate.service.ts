import { Injectable } from '@angular/core';
import { BaseCommunicateService } from '../../shared/base-communicate.service';
import { Machine } from './machine.model';

@Injectable()
export class MachineCommuncateService extends BaseCommunicateService<Machine> {
  constructor() { super() }
}
