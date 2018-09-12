import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardTimeDialogComponent } from './standard-time-dialog.component';

describe('StandardTimeDialogComponent', () => {
  let component: StandardTimeDialogComponent;
  let fixture: ComponentFixture<StandardTimeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardTimeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardTimeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
