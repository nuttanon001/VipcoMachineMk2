import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcardMasterWaitingLmsmComponent } from './jobcard-master-waiting-lmsm.component';

describe('JobcardMasterWaitingLmsmComponent', () => {
  let component: JobcardMasterWaitingLmsmComponent;
  let fixture: ComponentFixture<JobcardMasterWaitingLmsmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobcardMasterWaitingLmsmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobcardMasterWaitingLmsmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
