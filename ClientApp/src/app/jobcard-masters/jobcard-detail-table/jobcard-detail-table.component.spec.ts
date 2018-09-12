import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcardDetailTableComponent } from './jobcard-detail-table.component';

describe('JobcardDetailTableComponent', () => {
  let component: JobcardDetailTableComponent;
  let fixture: ComponentFixture<JobcardDetailTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobcardDetailTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobcardDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
