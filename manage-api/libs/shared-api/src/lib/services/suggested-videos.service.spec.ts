import { Test, TestingModule } from '@nestjs/testing';
import { SuggestedVideosService } from './suggested-videos.service';

describe('SuggestedVideosService', () => {
  let service: SuggestedVideosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuggestedVideosService],
    }).compile();

    service = module.get<SuggestedVideosService>(SuggestedVideosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
