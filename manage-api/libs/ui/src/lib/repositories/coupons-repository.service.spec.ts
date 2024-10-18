import { TestBed } from '@angular/core/testing';

import { CouponsRepositoryService } from './coupons-repository.service';

describe('CouponsRepositoryService', () => {
  let service: CouponsRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CouponsRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
