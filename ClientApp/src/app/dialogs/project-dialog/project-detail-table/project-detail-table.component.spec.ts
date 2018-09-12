import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailTableComponent } from './project-detail-table.component';

describe('ProjectDetailTableComponent', () => {
  let component: ProjectDetailTableComponent;
  let fixture: ComponentFixture<ProjectDetailTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectDetailTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
