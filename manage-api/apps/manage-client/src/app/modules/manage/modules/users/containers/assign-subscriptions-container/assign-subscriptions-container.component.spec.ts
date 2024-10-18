import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSubscriptionsContainerComponent } from './assign-subscriptions-container.component';

describe('AssignSubscriptionsContainerComponent', () => {
  let component: AssignSubscriptionsContainerComponent;
  let fixture: ComponentFixture<AssignSubscriptionsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignSubscriptionsContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSubscriptionsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
