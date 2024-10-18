import { Test, TestingModule } from '@nestjs/testing';
import { PearlsController } from './pearls.controller';

describe('Faculty Controller', () => {
  let controller: PearlsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PearlsController],
    }).compile();

    controller = module.get<PearlsController>(PearlsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
