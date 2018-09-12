import { TestBed, inject } from '@angular/core/testing';

import { StandardTimeCommuncateService } from './standard-time-communcate.service';

describe('StandardTimeCommuncateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StandardTimeCommuncateService]
    });
  });

  it('should be created', inject([StandardTimeCommuncateService], (service: StandardTimeCommuncateService) => {
    expect(service).toBeTruthy();
  }));
});
