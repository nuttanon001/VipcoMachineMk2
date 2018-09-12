import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcardMasterTableExtendComponent } from './jobcard-master-table-extend.component';

describe('JobcardMasterTableExtendComponent', () => {
  let component: JobcardMasterTableExtendComponent;
  let fixture: ComponentFixture<JobcardMasterTableExtendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobcardMasterTableExtendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobcardMasterTableExtendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
