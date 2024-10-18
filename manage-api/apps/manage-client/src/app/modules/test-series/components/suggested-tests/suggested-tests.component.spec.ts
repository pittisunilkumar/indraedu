import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedTestsComponent } from './suggested-tests.component';

describe('SuggestedTestsComponent', () => {
  let component: SuggestedTestsComponent;
  let fixture: ComponentFixture<SuggestedTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestedTestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
