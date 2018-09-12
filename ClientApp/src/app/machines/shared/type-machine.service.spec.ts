import { TestBed, inject } from '@angular/core/testing';

import { TypeMachineService } from './type-machine.service';

describe('TypeMachineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TypeMachineService]
    });
  });

  it('should be created', inject([TypeMachineService], (service: TypeMachineService) => {
    expect(service).toBeTruthy();
  }));
});
