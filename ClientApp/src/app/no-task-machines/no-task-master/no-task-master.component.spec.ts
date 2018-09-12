import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoTaskMasterComponent } from './no-task-master.component';

describe('NoTaskMasterComponent', () => {
  let component: NoTaskMasterComponent;
  let fixture: ComponentFixture<NoTaskMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoTaskMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoTaskMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
