import { Test, TestingModule } from '@nestjs/testing';
import { SubmitTopicResultsService } from './submit-topic-results.service';

describe('SubmitTopicResultsService', () => {
  let service: SubmitTopicResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmitTopicResultsService],
    }).compile();

    service = module.get<SubmitTopicResultsService>(SubmitTopicResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
