import { Test, TestingModule } from '@nestjs/testing';
import { SubmitQbankTopicService } from './submit-topic.service';

describe('SubmitQbankTopicService', () => {
  let service: SubmitQbankTopicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmitQbankTopicService],
    }).compile();

    service = module.get<SubmitQbankTopicService>(SubmitQbankTopicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
