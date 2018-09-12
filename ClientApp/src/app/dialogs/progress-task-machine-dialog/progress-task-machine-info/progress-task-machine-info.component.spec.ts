import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressTaskMachineInfoComponent } from './progress-task-machine-info.component';

describe('ProgressTaskMachineInfoComponent', () => {
  let component: ProgressTaskMachineInfoComponent;
  let fixture: ComponentFixture<ProgressTaskMachineInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressTaskMachineInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressTaskMachineInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
