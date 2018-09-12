import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineOperatorTableComponent } from './machine-operator-table.component';

describe('MachineOperatorTableComponent', () => {
  let component: MachineOperatorTableComponent;
  let fixture: ComponentFixture<MachineOperatorTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineOperatorTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineOperatorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
