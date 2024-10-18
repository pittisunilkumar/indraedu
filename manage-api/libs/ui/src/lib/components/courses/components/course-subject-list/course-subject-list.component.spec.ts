import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSubjectListComponent } from './course-subject-list.component';

describe('CourseSubjectListComponent', () => {
  let component: CourseSubjectListComponent;
  let fixture: ComponentFixture<CourseSubjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseSubjectListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseSubjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
