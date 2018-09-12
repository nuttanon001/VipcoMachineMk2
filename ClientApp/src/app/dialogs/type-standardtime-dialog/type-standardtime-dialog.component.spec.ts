import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeStandardtimeDialogComponent } from './type-standardtime-dialog.component';

describe('TypeStandardtimeDialogComponent', () => {
  let component: TypeStandardtimeDialogComponent;
  let fixture: ComponentFixture<TypeStandardtimeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeStandardtimeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeStandardtimeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
