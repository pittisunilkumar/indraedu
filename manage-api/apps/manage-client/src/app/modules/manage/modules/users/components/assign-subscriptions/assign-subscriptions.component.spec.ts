import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSubscriptionsComponent } from './assign-subscriptions.component';

describe('AssignSubscriptionsComponent', () => {
  let component: AssignSubscriptionsComponent;
  let fixture: ComponentFixture<AssignSubscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignSubscriptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
