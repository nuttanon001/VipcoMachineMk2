import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMachineCenterComponent } from './task-machine-center.component';

describe('TaskMachineCenterComponent', () => {
  let component: TaskMachineCenterComponent;
  let fixture: ComponentFixture<TaskMachineCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskMachineCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskMachineCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
