import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuttingPlanInfoDialogComponent } from './cutting-plan-info-dialog.component';

describe('CuttingPlanInfoDialogComponent', () => {
  let component: CuttingPlanInfoDialogComponent;
  let fixture: ComponentFixture<CuttingPlanInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuttingPlanInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuttingPlanInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
