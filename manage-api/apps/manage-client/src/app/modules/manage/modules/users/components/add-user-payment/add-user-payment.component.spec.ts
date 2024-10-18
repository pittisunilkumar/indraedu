import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserPaymentComponent } from './add-user-payment.component';

describe('AddUserPaymentComponent', () => {
  let component: AddUserPaymentComponent;
  let fixture: ComponentFixture<AddUserPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
