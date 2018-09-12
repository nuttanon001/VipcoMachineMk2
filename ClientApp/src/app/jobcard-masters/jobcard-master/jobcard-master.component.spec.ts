import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcardMasterComponent } from './jobcard-master.component';

describe('JobcardMasterComponent', () => {
  let component: JobcardMasterComponent;
  let fixture: ComponentFixture<JobcardMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobcardMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobcardMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
