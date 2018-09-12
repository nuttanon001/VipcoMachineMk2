import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCenterComponent } from './employee-center.component';

describe('EmployeeCenterComponent', () => {
  let component: EmployeeCenterComponent;
  let fixture: ComponentFixture<EmployeeCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
