import { Test, TestingModule } from '@nestjs/testing';
import { SuggestedTestsService } from './suggested-tests.service';

describe('SuggestedTestsService', () => {
  let service: SuggestedTestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuggestedTestsService],
    }).compile();

    service = module.get<SuggestedTestsService>(SuggestedTestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
