import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPaymentsContainerComponent } from './user-payments-container.component';

describe('UserPaymentsContainerComponent', () => {
  let component: UserPaymentsContainerComponent;
  let fixture: ComponentFixture<UserPaymentsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPaymentsContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPaymentsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
