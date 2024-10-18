import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McqQuestionsListComponent } from './mcq-questions-list.component';

describe('McqQuestionsListComponent', () => {
  let component: McqQuestionsListComponent;
  let fixture: ComponentFixture<McqQuestionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McqQuestionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McqQuestionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
