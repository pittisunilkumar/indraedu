import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBlankQuestionsComponent } from './create-blank-questions.component';

describe('CreateBlankQuestionsComponent', () => {
  let component: CreateBlankQuestionsComponent;
  let fixture: ComponentFixture<CreateBlankQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBlankQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBlankQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
