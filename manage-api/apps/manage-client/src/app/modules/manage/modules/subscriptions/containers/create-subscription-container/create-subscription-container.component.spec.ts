import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubscriptionContainerComponent } from './create-subscription-container.component';

describe('CreateSubscriptionContainerComponent', () => {
  let component: CreateSubscriptionContainerComponent;
  let fixture: ComponentFixture<CreateSubscriptionContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSubscriptionContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubscriptionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
