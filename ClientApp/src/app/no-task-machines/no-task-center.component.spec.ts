import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoTaskCenterComponent } from './no-task-center.component';

describe('NoTaskCenterComponent', () => {
  let component: NoTaskCenterComponent;
  let fixture: ComponentFixture<NoTaskCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoTaskCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoTaskCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
