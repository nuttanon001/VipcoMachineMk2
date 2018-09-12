import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineTableExtendComponent } from './machine-table-extend.component';

describe('MachineTableExtendComponent', () => {
  let component: MachineTableExtendComponent;
  let fixture: ComponentFixture<MachineTableExtendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineTableExtendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineTableExtendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
