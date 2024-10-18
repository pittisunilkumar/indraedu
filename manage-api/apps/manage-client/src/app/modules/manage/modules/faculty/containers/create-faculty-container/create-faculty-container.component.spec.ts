import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFacultyContainerComponent } from './create-faculty-container.component';

describe('CreateFacultyContainerComponent', () => {
  let component: CreateFacultyContainerComponent;
  let fixture: ComponentFixture<CreateFacultyContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFacultyContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFacultyContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
