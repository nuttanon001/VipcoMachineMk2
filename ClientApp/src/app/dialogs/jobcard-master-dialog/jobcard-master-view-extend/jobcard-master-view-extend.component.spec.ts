import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcardMasterViewExtendComponent } from './jobcard-master-view-extend.component';

describe('JobcardMasterViewExtendComponent', () => {
  let component: JobcardMasterViewExtendComponent;
  let fixture: ComponentFixture<JobcardMasterViewExtendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobcardMasterViewExtendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobcardMasterViewExtendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
