import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineTableComponent } from './machine-table.component';

describe('MachineTableComponent', () => {
  let component: MachineTableComponent;
  let fixture: ComponentFixture<MachineTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
