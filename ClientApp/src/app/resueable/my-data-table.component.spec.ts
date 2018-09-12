import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDataTableComponent } from './my-data-table.component';

describe('MyDataTableComponent', () => {
  let component: MyDataTableComponent;
  let fixture: ComponentFixture<MyDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
