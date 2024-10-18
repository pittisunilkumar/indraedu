import { Test, TestingModule } from '@nestjs/testing';
import { TestSeriesCategoryService } from './test-series-category.service';

describe('TestSeriesCategoryService', () => {
  let service: TestSeriesCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestSeriesCategoryService],
    }).compile();

    service = module.get<TestSeriesCategoryService>(TestSeriesCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
