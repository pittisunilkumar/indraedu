import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayReceiptComponent } from './pay-receipt.component';

describe('PayReceiptComponent', () => {
  let component: PayReceiptComponent;
  let fixture: ComponentFixture<PayReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
