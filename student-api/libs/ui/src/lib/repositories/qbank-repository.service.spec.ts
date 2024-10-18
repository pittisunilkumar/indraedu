import { TestBed } from '@angular/core/testing';

import { QBankRepositoryService } from './qbank-repository.service';

describe('QBankRepositoryService', () => {
  let service: QBankRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QBankRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
