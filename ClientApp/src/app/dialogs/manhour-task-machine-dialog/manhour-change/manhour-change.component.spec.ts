import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManhourChangeComponent } from './manhour-change.component';

describe('ManhourChangeComponent', () => {
  let component: ManhourChangeComponent;
  let fixture: ComponentFixture<ManhourChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManhourChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManhourChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
