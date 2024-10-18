import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrueFalseQuestionsComponent } from './create-true-false-questions.component';

describe('CreateTrueFalseQuestionsComponent', () => {
  let component: CreateTrueFalseQuestionsComponent;
  let fixture: ComponentFixture<CreateTrueFalseQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTrueFalseQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrueFalseQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
