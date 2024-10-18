import { Test, TestingModule } from '@nestjs/testing';
import { QbankService } from './qbank.service';

describe('QbankService', () => {
  let service: QbankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QbankService],
    }).compile();

    service = module.get<QbankService>(QbankService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
