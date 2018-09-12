import { TestBed, inject } from '@angular/core/testing';

import { NoTaskMachineService } from './no-task-machine.service';

describe('NoTaskMachineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoTaskMachineService]
    });
  });

  it('should be created', inject([NoTaskMachineService], (service: NoTaskMachineService) => {
    expect(service).toBeTruthy();
  }));
});
