import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyMoveQuestionsComponent } from './copy-move-questions.component';

describe('CopyMoveQuestionsComponent', () => {
  let component: CopyMoveQuestionsComponent;
  let fixture: ComponentFixture<CopyMoveQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyMoveQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyMoveQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
