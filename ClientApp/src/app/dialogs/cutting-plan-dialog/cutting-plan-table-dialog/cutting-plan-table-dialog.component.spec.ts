import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuttingPlanTableDialogComponent } from './cutting-plan-table-dialog.component';

describe('CuttingPlanTableDialogComponent', () => {
  let component: CuttingPlanTableDialogComponent;
  let fixture: ComponentFixture<CuttingPlanTableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuttingPlanTableDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuttingPlanTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
