import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuttingPlanDialogComponent } from './cutting-plan-dialog.component';

describe('CuttingPlanDialogComponent', () => {
  let component: CuttingPlanDialogComponent;
  let fixture: ComponentFixture<CuttingPlanDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuttingPlanDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuttingPlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
