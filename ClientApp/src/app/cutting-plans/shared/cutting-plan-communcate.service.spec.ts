import { TestBed, inject } from '@angular/core/testing';

import { CuttingPlanCommuncateService } from './cutting-plan-communcate.service';

describe('CuttingPlanCommuncateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CuttingPlanCommuncateService]
    });
  });

  it('should be created', inject([CuttingPlanCommuncateService], (service: CuttingPlanCommuncateService) => {
    expect(service).toBeTruthy();
  }));
});
