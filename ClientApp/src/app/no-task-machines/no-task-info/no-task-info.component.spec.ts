import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoTaskInfoComponent } from './no-task-info.component';

describe('NoTaskInfoComponent', () => {
  let component: NoTaskInfoComponent;
  let fixture: ComponentFixture<NoTaskInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoTaskInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoTaskInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
