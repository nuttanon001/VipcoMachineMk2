import { TestBed, inject } from '@angular/core/testing';

import { JobcardMasterCommuncateService } from './jobcard-master-communcate.service';

describe('JobcardMasterCommuncateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobcardMasterCommuncateService]
    });
  });

  it('should be created', inject([JobcardMasterCommuncateService], (service: JobcardMasterCommuncateService) => {
    expect(service).toBeTruthy();
  }));
});
