import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCourseContainerComponent } from './create-course-container.component';

describe('CreateCourseContainerComponent', () => {
  let component: CreateCourseContainerComponent;
  let fixture: ComponentFixture<CreateCourseContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCourseContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCourseContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
