import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserPaymentContainerComponent } from './add-user-payment-container.component';

describe('AddUserPaymentContainerComponent', () => {
  let component: AddUserPaymentContainerComponent;
  let fixture: ComponentFixture<AddUserPaymentContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserPaymentContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserPaymentContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
