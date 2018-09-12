import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcardMasterDialogComponent } from './jobcard-master-dialog.component';

describe('JobcardMasterDialogComponent', () => {
  let component: JobcardMasterDialogComponent;
  let fixture: ComponentFixture<JobcardMasterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobcardMasterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobcardMasterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
