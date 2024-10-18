import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMatchQuestionsComponent } from './create-match-questions.component';

describe('CreateMatchQuestionsComponent', () => {
  let component: CreateMatchQuestionsComponent;
  let fixture: ComponentFixture<CreateMatchQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMatchQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMatchQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
