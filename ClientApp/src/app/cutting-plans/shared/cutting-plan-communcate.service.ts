import { Injectable } from '@angular/core';
import { BaseCommunicateService } from '../../shared/base-communicate.service';
import { CuttingPlan } from './cutting-plan.model';

@Injectable()
export class CuttingPlanCommuncateService
    extends BaseCommunicateService<CuttingPlan> {
  constructor() { super(); }
}
