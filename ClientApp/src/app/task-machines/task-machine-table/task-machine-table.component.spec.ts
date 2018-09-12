import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMachineTableComponent } from './task-machine-table.component';

describe('TaskMachineTableComponent', () => {
  let component: TaskMachineTableComponent;
  let fixture: ComponentFixture<TaskMachineTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskMachineTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskMachineTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
