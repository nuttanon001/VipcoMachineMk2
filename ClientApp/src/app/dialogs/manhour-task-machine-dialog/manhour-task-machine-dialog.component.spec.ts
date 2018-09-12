import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManhourTaskMachineDialogComponent } from './manhour-task-machine-dialog.component';

describe('ManhourTaskMachineDialogComponent', () => {
  let component: ManhourTaskMachineDialogComponent;
  let fixture: ComponentFixture<ManhourTaskMachineDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManhourTaskMachineDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManhourTaskMachineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
