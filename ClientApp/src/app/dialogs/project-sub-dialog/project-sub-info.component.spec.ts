import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSubInfoComponent } from './project-sub-info.component';

describe('ProjectSubInfoComponent', () => {
  let component: ProjectSubInfoComponent;
  let fixture: ComponentFixture<ProjectSubInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectSubInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSubInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
