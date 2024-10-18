import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedQbankTopicsComponent } from './suggested-qbank-topics.component';

describe('SuggestedQbankTopicsComponent', () => {
  let component: SuggestedQbankTopicsComponent;
  let fixture: ComponentFixture<SuggestedQbankTopicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestedQbankTopicsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedQbankTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
