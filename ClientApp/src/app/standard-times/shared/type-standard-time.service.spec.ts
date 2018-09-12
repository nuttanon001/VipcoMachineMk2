import { TestBed, inject } from '@angular/core/testing';

import { TypeStandardTimeService } from './type-standard-time.service';

describe('TypeStandardTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TypeStandardTimeService]
    });
  });

  it('should be created', inject([TypeStandardTimeService], (service: TypeStandardTimeService) => {
    expect(service).toBeTruthy();
  }));
});
