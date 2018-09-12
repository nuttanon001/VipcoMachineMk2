import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMachineScheduleComponent } from './task-machine-schedule.component';

describe('TaskMachineScheduleComponent', () => {
  let component: TaskMachineScheduleComponent;
  let fixture: ComponentFixture<TaskMachineScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskMachineScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskMachineScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
