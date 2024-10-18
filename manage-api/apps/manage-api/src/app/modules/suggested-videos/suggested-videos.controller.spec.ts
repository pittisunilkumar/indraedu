import { Test, TestingModule } from '@nestjs/testing';
import { SuggestedVideosController } from './suggested-videos.controller';

describe('SuggestedVideos Controller', () => {
  let controller: SuggestedVideosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuggestedVideosController],
    }).compile();

    controller = module.get<SuggestedVideosController>(SuggestedVideosController);
  });
  
  it('should be defined', () => {
    expect(controller).toBeDefined();
    
  });
});
