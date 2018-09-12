import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcardMasterTableComponent } from './jobcard-master-table.component';

describe('JobcardMasterTableComponent', () => {
  let component: JobcardMasterTableComponent;
  let fixture: ComponentFixture<JobcardMasterTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobcardMasterTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobcardMasterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
