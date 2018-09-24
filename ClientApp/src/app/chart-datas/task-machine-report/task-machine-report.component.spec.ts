import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMachineReportComponent } from './task-machine-report.component';

describe('TaskMachineReportComponent', () => {
  let component: TaskMachineReportComponent;
  let fixture: ComponentFixture<TaskMachineReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskMachineReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskMachineReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
