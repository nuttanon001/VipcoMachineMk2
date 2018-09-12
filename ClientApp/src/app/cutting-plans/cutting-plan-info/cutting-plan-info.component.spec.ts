import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuttingPlanInfoComponent } from './cutting-plan-info.component';

describe('CuttingPlanInfoComponent', () => {
  let component: CuttingPlanInfoComponent;
  let fixture: ComponentFixture<CuttingPlanInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuttingPlanInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuttingPlanInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
