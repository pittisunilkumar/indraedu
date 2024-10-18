import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionsContainerComponent } from './create-questions-container.component';

describe('CreateQuestionsContainerComponent', () => {
  let component: CreateQuestionsContainerComponent;
  let fixture: ComponentFixture<CreateQuestionsContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateQuestionsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateQuestionsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
