import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McqQuestionsComponent } from './mcq-questions.component';

describe('McqQuestionsComponent', () => {
  let component: McqQuestionsComponent;
  let fixture: ComponentFixture<McqQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McqQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McqQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
