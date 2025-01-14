import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionPreviewComponent } from './question-preview.component';

describe('QuestionPreviewComponent', () => {
  let component: QuestionPreviewComponent;
  let fixture: ComponentFixture<QuestionPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
