import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardTimeCenterComponent } from './standard-time-center.component';

describe('StandardTimeCenterComponent', () => {
  let component: StandardTimeCenterComponent;
  let fixture: ComponentFixture<StandardTimeCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardTimeCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardTimeCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
