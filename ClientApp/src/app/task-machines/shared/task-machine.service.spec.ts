import { TestBed, inject } from '@angular/core/testing';

import { TaskMachineService } from './task-machine.service';

describe('TaskMachineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskMachineService]
    });
  });

  it('should be created', inject([TaskMachineService], (service: TaskMachineService) => {
    expect(service).toBeTruthy();
  }));
});
