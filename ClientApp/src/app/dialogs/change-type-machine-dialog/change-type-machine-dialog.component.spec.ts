import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTypeMachineDialogComponent } from './change-type-machine-dialog.component';

describe('ChangeTypeMachineDialogComponent', () => {
  let component: ChangeTypeMachineDialogComponent;
  let fixture: ComponentFixture<ChangeTypeMachineDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeTypeMachineDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeTypeMachineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
