import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuttingPlanMasterComponent } from './cutting-plan-master.component';

describe('CuttingPlanMasterComponent', () => {
  let component: CuttingPlanMasterComponent;
  let fixture: ComponentFixture<CuttingPlanMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuttingPlanMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuttingPlanMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
