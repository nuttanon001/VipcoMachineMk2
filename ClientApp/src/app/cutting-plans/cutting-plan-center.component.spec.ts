import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuttingPlanCenterComponent } from './cutting-plan-center.component';

describe('CuttingPlanCenterComponent', () => {
  let component: CuttingPlanCenterComponent;
  let fixture: ComponentFixture<CuttingPlanCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuttingPlanCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuttingPlanCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
