import { Test, TestingModule } from '@nestjs/testing';
import { MobileQbankSubjectService } from './qbank-subject.service';

describe('MobileQbankSubjectService', () => {
  let service: MobileQbankSubjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MobileQbankSubjectService],
    }).compile();

    service = module.get<MobileQbankSubjectService>(MobileQbankSubjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
