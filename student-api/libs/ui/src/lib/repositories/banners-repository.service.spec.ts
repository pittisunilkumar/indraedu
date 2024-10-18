import { TestBed } from '@angular/core/testing';

import { BannersRepositoryService } from './banners-repository.service';

describe('BannersRepositoryService', () => {
  let service: BannersRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BannersRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
