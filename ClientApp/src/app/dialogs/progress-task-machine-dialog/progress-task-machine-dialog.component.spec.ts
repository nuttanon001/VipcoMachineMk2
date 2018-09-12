import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressTaskMachineDialogComponent } from './progress-task-machine-dialog.component';

describe('ProgressTaskMachineDialogComponent', () => {
  let component: ProgressTaskMachineDialogComponent;
  let fixture: ComponentFixture<ProgressTaskMachineDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressTaskMachineDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressTaskMachineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
