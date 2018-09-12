import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuttingPlanImportComponent } from './cutting-plan-import.component';

describe('CuttingPlanImportComponent', () => {
  let component: CuttingPlanImportComponent;
  let fixture: ComponentFixture<CuttingPlanImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuttingPlanImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuttingPlanImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
