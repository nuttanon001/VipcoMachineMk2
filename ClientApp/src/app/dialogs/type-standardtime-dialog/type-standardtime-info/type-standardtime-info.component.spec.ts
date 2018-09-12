import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeStandardtimeInfoComponent } from './type-standardtime-info.component';

describe('TypeStandardtimeInfoComponent', () => {
  let component: TypeStandardtimeInfoComponent;
  let fixture: ComponentFixture<TypeStandardtimeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeStandardtimeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeStandardtimeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
