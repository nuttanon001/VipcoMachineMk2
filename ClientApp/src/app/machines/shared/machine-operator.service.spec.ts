import { TestBed, inject } from '@angular/core/testing';

import { MachineOperatorService } from './machine-operator.service';

describe('MachineOperatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MachineOperatorService]
    });
  });

  it('should be created', inject([MachineOperatorService], (service: MachineOperatorService) => {
    expect(service).toBeTruthy();
  }));
});
