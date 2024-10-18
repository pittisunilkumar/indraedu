import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentPaymentContainerComponent } from './agent-payment-container.component';

describe('AgentPaymentContainerComponent', () => {
  let component: AgentPaymentContainerComponent;
  let fixture: ComponentFixture<AgentPaymentContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentPaymentContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentPaymentContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
