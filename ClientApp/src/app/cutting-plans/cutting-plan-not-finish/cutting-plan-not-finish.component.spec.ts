import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuttingPlanNotFinishComponent } from './cutting-plan-not-finish.component';

describe('CuttingPlanNotFinishComponent', () => {
  let component: CuttingPlanNotFinishComponent;
  let fixture: ComponentFixture<CuttingPlanNotFinishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuttingPlanNotFinishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuttingPlanNotFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
