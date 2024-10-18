import { TestBed } from '@angular/core/testing';

import { TestSeriesCategoriesRepositoryService } from './test-series-categories-repository.service';

describe('TestSeriesCategoriesRepositoryService', () => {
  let service: TestSeriesCategoriesRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestSeriesCategoriesRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
