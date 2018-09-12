import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineCenterComponent } from './machine-center.component';

describe('MachineCenterComponent', () => {
  let component: MachineCenterComponent;
  let fixture: ComponentFixture<MachineCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
