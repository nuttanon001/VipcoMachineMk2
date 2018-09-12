import { TestBed, inject } from '@angular/core/testing';

import { TaskMachineCommunicateService } from './task-machine-communicate.service';

describe('TaskMachineCommunicateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskMachineCommunicateService]
    });
  });

  it('should be created', inject([TaskMachineCommunicateService], (service: TaskMachineCommunicateService) => {
    expect(service).toBeTruthy();
  }));
});
