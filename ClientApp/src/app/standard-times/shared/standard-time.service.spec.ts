import { TestBed, inject } from '@angular/core/testing';

import { StandardTimeService } from './standard-time.service';

describe('StandardTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StandardTimeService]
    });
  });

  it('should be created', inject([StandardTimeService], (service: StandardTimeService) => {
    expect(service).toBeTruthy();
  }));
});
