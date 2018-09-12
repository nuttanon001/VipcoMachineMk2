import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMachineProgressTableComponent } from './task-machine-progress-table.component';

describe('TaskMachineProgressTableComponent', () => {
  let component: TaskMachineProgressTableComponent;
  let fixture: ComponentFixture<TaskMachineProgressTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskMachineProgressTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskMachineProgressTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
