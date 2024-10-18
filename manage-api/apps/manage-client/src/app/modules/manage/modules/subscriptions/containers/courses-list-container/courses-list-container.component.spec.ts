import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesListContainerComponent } from './courses-list-container.component';

describe('CoursesListContainerComponent', () => {
  let component: CoursesListContainerComponent;
  let fixture: ComponentFixture<CoursesListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursesListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
