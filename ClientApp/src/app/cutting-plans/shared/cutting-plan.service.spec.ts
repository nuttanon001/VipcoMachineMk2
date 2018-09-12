import { TestBed, inject } from '@angular/core/testing';

import { CuttingPlanService } from './cutting-plan.service';

describe('CuttingPlanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CuttingPlanService]
    });
  });

  it('should be created', inject([CuttingPlanService], (service: CuttingPlanService) => {
    expect(service).toBeTruthy();
  }));
});
