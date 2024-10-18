import { Test, TestingModule } from '@nestjs/testing';
import { VideoCipherController } from './video-cipher.controller';

describe('VideoCipher Controller', () => {
  let controller: VideoCipherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoCipherController],
    }).compile();

    controller = module.get<VideoCipherController>(VideoCipherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
