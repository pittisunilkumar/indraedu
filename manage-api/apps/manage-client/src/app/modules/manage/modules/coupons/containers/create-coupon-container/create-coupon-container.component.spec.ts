import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCouponContainerComponent } from './create-coupon-container.component';

describe('CreateCouponContainerComponent', () => {
  let component: CreateCouponContainerComponent;
  let fixture: ComponentFixture<CreateCouponContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCouponContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCouponContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
