import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyQuestionsComponent } from './copy-questions.component';

describe('CopyQuestionsComponent', () => {
  let component: CopyQuestionsComponent;
  let fixture: ComponentFixture<CopyQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
