import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardTimeTableExtendComponent } from './standard-time-table-extend.component';

describe('StandardTimeTableExtendComponent', () => {
  let component: StandardTimeTableExtendComponent;
  let fixture: ComponentFixture<StandardTimeTableExtendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardTimeTableExtendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardTimeTableExtendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
