import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsInfoComponent } from './subscriptions-info.component';

describe('SubscriptionsInfoComponent', () => {
  let component: SubscriptionsInfoComponent;
  let fixture: ComponentFixture<SubscriptionsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionsInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
