import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMachineMasterComponent } from './task-machine-master.component';

describe('TaskMachineMasterComponent', () => {
  let component: TaskMachineMasterComponent;
  let fixture: ComponentFixture<TaskMachineMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskMachineMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskMachineMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
