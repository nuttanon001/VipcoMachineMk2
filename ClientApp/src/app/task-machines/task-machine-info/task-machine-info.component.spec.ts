import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMachineInfoComponent } from './task-machine-info.component';

describe('TaskMachineInfoComponent', () => {
  let component: TaskMachineInfoComponent;
  let fixture: ComponentFixture<TaskMachineInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskMachineInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskMachineInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
