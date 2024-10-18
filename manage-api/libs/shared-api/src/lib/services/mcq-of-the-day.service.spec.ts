import { Test, TestingModule } from '@nestjs/testing';
import { MCQOfTheDayService } from './mcq-of-the-day.service';

describe('MCQOfTheDayService', () => {
  let service: MCQOfTheDayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MCQOfTheDayService],
    }).compile();

    service = module.get<MCQOfTheDayService>(MCQOfTheDayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
