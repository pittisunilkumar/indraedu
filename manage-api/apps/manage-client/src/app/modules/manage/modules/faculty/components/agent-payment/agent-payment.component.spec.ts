import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentPaymentComponent } from './agent-payment.component';

describe('AgentPaymentComponent', () => {
  let component: AgentPaymentComponent;
  let fixture: ComponentFixture<AgentPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
