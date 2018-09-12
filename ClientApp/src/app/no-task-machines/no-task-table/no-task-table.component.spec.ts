import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoTaskTableComponent } from './no-task-table.component';

describe('NoTaskTableComponent', () => {
  let component: NoTaskTableComponent;
  let fixture: ComponentFixture<NoTaskTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoTaskTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoTaskTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
