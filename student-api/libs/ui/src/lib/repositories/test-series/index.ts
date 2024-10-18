import { TestCategoriesRepositoryService } from './test-categories-repository.service';
import { TestsRepositoryService } from './tests-repository.service';

export const repositories = [
  TestCategoriesRepositoryService,
  TestsRepositoryService
];

export * from './test-categories-repository.service';
export * from './tests-repository.service';
