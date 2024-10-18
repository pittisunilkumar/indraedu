import { TestBed } from '@angular/core/testing';

import { PortalRepositoryService } from './portal-repository.service';

describe('PortalRepositoryService', () => {
  let service: PortalRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortalRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
