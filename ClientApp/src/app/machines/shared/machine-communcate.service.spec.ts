import { TestBed, inject } from '@angular/core/testing';

import { MachineCommuncateService } from './machine-communcate.service';

describe('MachineCommuncateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MachineCommuncateService]
    });
  });

  it('should be created', inject([MachineCommuncateService], (service: MachineCommuncateService) => {
    expect(service).toBeTruthy();
  }));
});
