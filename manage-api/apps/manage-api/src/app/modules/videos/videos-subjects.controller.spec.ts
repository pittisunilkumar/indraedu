import { Test, TestingModule } from '@nestjs/testing';
import { VideosSubjectController } from './videos-subjects.controller';

describe('VideosSubjectController', () => {

  let controller: VideosSubjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideosSubjectController],
    }).compile();

    controller = module.get<VideosSubjectController>(VideosSubjectController);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
