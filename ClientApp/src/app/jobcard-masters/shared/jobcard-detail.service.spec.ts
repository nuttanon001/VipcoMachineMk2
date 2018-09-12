import { TestBed, inject } from '@angular/core/testing';

import { JobcardDetailService } from './jobcard-detail.service';

describe('JobcardDetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobcardDetailService]
    });
  });

  it('should be created', inject([JobcardDetailService], (service: JobcardDetailService) => {
    expect(service).toBeTruthy();
  }));
});
