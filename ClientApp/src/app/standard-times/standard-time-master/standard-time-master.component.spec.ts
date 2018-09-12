import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardTimeMasterComponent } from './standard-time-master.component';

describe('StandardTimeMasterComponent', () => {
  let component: StandardTimeMasterComponent;
  let fixture: ComponentFixture<StandardTimeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardTimeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardTimeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
