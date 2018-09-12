import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcardMasterInfoComponent } from './jobcard-master-info.component';

describe('JobcardMasterInfoComponent', () => {
  let component: JobcardMasterInfoComponent;
  let fixture: ComponentFixture<JobcardMasterInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobcardMasterInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobcardMasterInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
