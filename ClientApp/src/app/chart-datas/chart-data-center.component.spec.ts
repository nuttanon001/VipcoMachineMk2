import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartDataCenterComponent } from './chart-data-center.component';

describe('ChartDataCenterComponent', () => {
  let component: ChartDataCenterComponent;
  let fixture: ComponentFixture<ChartDataCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartDataCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartDataCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
