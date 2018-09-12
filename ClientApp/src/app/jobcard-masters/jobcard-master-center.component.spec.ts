import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcardMasterCenterComponent } from './jobcard-master-center.component';

describe('JobcardMasterCenterComponent', () => {
  let component: JobcardMasterCenterComponent;
  let fixture: ComponentFixture<JobcardMasterCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobcardMasterCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobcardMasterCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
