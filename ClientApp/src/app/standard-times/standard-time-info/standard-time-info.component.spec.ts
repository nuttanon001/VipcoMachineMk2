import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardTimeInfoComponent } from './standard-time-info.component';

describe('StandardTimeInfoComponent', () => {
  let component: StandardTimeInfoComponent;
  let fixture: ComponentFixture<StandardTimeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardTimeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardTimeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
