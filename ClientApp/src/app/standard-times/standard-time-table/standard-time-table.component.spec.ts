import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardTimeTableComponent } from './standard-time-table.component';

describe('StandardTimeTableComponent', () => {
  let component: StandardTimeTableComponent;
  let fixture: ComponentFixture<StandardTimeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardTimeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
