import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcardDetailInfoComponent } from './jobcard-detail-info.component';

describe('JobcardDetailInfoComponent', () => {
  let component: JobcardDetailInfoComponent;
  let fixture: ComponentFixture<JobcardDetailInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobcardDetailInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobcardDetailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
