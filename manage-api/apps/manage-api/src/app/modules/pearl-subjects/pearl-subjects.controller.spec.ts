import { Test, TestingModule } from '@nestjs/testing';
import { PearlSubjectsController } from './pearl-subjects.controller';

describe('Faculty Controller', () => {
  let controller: PearlSubjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PearlSubjectsController],
    }).compile();

    controller = module.get<PearlSubjectsController>(PearlSubjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
