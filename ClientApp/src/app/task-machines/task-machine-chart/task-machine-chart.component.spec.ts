import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMachineChartComponent } from './task-machine-chart.component';

describe('TaskMachineChartComponent', () => {
  let component: TaskMachineChartComponent;
  let fixture: ComponentFixture<TaskMachineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskMachineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskMachineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
