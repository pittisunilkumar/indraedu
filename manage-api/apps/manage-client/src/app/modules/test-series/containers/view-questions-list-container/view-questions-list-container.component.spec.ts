import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQuestionsListContainerComponent } from './view-questions-list-container.component';

describe('ViewQuestionsListContainerComponent', () => {
  let component: ViewQuestionsListContainerComponent;
  let fixture: ComponentFixture<ViewQuestionsListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewQuestionsListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQuestionsListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
