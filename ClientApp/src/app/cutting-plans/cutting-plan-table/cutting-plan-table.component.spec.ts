import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuttingPlanTableComponent } from './cutting-plan-table.component';

describe('CuttingPlanTableComponent', () => {
  let component: CuttingPlanTableComponent;
  let fixture: ComponentFixture<CuttingPlanTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuttingPlanTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuttingPlanTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
