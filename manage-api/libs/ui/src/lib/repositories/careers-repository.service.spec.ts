import { TestBed } from '@angular/core/testing';

import { CareersRepositoryService } from './careers-repository.service';

describe('CareersRepositoryService', () => {
  let service: CareersRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CareersRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
