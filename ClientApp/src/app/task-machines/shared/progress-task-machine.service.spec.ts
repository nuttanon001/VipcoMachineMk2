import { TestBed, inject } from '@angular/core/testing';

import { ProgressTaskMachineService } from './progress-task-machine.service';

describe('ProgressTaskMachineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProgressTaskMachineService]
    });
  });

  it('should be created', inject([ProgressTaskMachineService], (service: ProgressTaskMachineService) => {
    expect(service).toBeTruthy();
  }));
});
