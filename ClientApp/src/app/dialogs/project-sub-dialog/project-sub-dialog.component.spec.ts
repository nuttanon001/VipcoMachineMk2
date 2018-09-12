import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSubDialogComponent } from './project-sub-dialog.component';

describe('ProjectSubDialogComponent', () => {
  let component: ProjectSubDialogComponent;
  let fixture: ComponentFixture<ProjectSubDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectSubDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSubDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
