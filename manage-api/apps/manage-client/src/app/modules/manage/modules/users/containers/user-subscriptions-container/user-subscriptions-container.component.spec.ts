import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSubscriptionsContainerComponent } from './user-subscriptions-container.component';

describe('UserSubscriptionsContainerComponent', () => {
  let component: UserSubscriptionsContainerComponent;
  let fixture: ComponentFixture<UserSubscriptionsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSubscriptionsContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSubscriptionsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
