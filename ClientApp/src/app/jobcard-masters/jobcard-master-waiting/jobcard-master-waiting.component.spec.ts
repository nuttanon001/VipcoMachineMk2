import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcardMasterWaitingComponent } from './jobcard-master-waiting.component';

describe('JobcardMasterWaitingComponent', () => {
  let component: JobcardMasterWaitingComponent;
  let fixture: ComponentFixture<JobcardMasterWaitingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobcardMasterWaitingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobcardMasterWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
