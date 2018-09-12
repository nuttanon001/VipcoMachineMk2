import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardTimeInfoExtendComponent } from './standard-time-info-extend.component';

describe('StandardTimeInfoExtendComponent', () => {
  let component: StandardTimeInfoExtendComponent;
  let fixture: ComponentFixture<StandardTimeInfoExtendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardTimeInfoExtendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardTimeInfoExtendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
