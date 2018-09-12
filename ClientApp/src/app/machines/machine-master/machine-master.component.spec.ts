import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineMasterComponent } from './machine-master.component';

describe('MachineMasterComponent', () => {
  let component: MachineMasterComponent;
  let fixture: ComponentFixture<MachineMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
