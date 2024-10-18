import { TestBed } from '@angular/core/testing';
import { TestCategoriesRepositoryService } from './test-categories-repository.service';

describe('TestCategoriesRepositoryService', () => {
  let service: TestCategoriesRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestCategoriesRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
