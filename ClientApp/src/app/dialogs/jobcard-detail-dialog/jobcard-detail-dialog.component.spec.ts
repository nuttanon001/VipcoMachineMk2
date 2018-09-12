import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcardDetailDialogComponent } from './jobcard-detail-dialog.component';

describe('JobcardDetailDialogComponent', () => {
  let component: JobcardDetailDialogComponent;
  let fixture: ComponentFixture<JobcardDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobcardDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobcardDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
