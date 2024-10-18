import { Test, TestingModule } from '@nestjs/testing';
import { VideoSubjectsController } from './video-subjects.controller';

describe('VideoSubjects Controller', () => {
  let controller: VideoSubjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoSubjectsController],
    }).compile();

    controller = module.get<VideoSubjectsController>(VideoSubjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
