import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSyllabusContainerComponent } from './create-syllabus-container.component';

describe('CreateSyllabusContainerComponent', () => {
  let component: CreateSyllabusContainerComponent;
  let fixture: ComponentFixture<CreateSyllabusContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSyllabusContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSyllabusContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
