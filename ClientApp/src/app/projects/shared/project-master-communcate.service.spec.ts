import { TestBed, inject } from '@angular/core/testing';

import { ProjectMasterCommuncateService } from './project-master-communcate.service';

describe('ProjectMasterCommuncateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectMasterCommuncateService]
    });
  });

  it('should be created', inject([ProjectMasterCommuncateService], (service: ProjectMasterCommuncateService) => {
    expect(service).toBeTruthy();
  }));
});
