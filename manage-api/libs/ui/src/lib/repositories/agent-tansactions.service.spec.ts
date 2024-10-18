import { TestBed } from '@angular/core/testing';

import { AgentTansactionsService } from './agent-tansactions.service';

describe('AgentTansactionsService', () => {
  let service: AgentTansactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentTansactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
