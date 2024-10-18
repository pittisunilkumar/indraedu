import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentPaymentsListComponent } from './agent-payments-list.component';

describe('AgentPaymentsListComponent', () => {
  let component: AgentPaymentsListComponent;
  let fixture: ComponentFixture<AgentPaymentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentPaymentsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
