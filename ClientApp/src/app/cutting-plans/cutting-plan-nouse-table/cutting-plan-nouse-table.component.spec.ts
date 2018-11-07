import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuttingPlanNouseTableComponent } from './cutting-plan-nouse-table.component';

describe('CuttingPlanNouseTableComponent', () => {
  let component: CuttingPlanNouseTableComponent;
  let fixture: ComponentFixture<CuttingPlanNouseTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuttingPlanNouseTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuttingPlanNouseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
