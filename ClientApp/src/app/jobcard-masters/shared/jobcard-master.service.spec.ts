import { TestBed, inject } from '@angular/core/testing';

import { JobcardMasterService } from './jobcard-master.service';

describe('JobcardMasterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobcardMasterService]
    });
  });

  it('should be created', inject([JobcardMasterService], (service: JobcardMasterService) => {
    expect(service).toBeTruthy();
  }));
});
