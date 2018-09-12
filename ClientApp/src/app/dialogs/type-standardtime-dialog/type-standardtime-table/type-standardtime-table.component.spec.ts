import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeStandardtimeTableComponent } from './type-standardtime-table.component';

describe('TypeStandardtimeTableComponent', () => {
  let component: TypeStandardtimeTableComponent;
  let fixture: ComponentFixture<TypeStandardtimeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeStandardtimeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeStandardtimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
