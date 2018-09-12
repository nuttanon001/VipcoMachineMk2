import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSubTableComponent } from './project-sub-table.component';

describe('ProjectSubTableComponent', () => {
  let component: ProjectSubTableComponent;
  let fixture: ComponentFixture<ProjectSubTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectSubTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSubTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
