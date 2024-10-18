import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsListContainerComponent } from './subscriptions-list-container.component';

describe('SubscriptionsListContainerComponent', () => {
  let component: SubscriptionsListContainerComponent;
  let fixture: ComponentFixture<SubscriptionsListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionsListContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionsListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
