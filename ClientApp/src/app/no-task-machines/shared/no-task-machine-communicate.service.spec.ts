import { TestBed, inject } from '@angular/core/testing';

import { NoTaskMachineCommunicateService } from './no-task-machine-communicate.service';

describe('NoTaskMachineCommunicateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoTaskMachineCommunicateService]
    });
  });

  it('should be created', inject([NoTaskMachineCommunicateService], (service: NoTaskMachineCommunicateService) => {
    expect(service).toBeTruthy();
  }));
});
