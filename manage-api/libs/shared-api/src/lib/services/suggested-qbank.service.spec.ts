import { Test, TestingModule } from '@nestjs/testing';
import { SuggestedQbankService } from './suggested-qbank.service';

describe('SuggestedQbankService', () => {
  let service: SuggestedQbankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuggestedQbankService],
    }).compile();

    service = module.get<SuggestedQbankService>(SuggestedQbankService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
