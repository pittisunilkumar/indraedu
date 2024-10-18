import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseListContainerComponent } from './course-list-container.component';

describe('CourseListContainerComponent', () => {
  let component: CourseListContainerComponent;
  let fixture: ComponentFixture<CourseListContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseListContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
