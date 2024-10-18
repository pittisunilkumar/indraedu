import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsListContainerComponent } from './questions-list-container.component';

describe('QuestionsListContainerComponent', () => {
  let component: QuestionsListContainerComponent;
  let fixture: ComponentFixture<QuestionsListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionsListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
