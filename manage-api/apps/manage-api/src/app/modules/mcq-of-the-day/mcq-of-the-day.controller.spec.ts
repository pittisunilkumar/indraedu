import { Test, TestingModule } from '@nestjs/testing';
import { MCQOfTheDayController } from './mcq-of-the-day.controller';

describe('MCQOfTheDay Controller', () => {
  let controller: MCQOfTheDayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MCQOfTheDayController],
    }).compile();

    controller = module.get<MCQOfTheDayController>(MCQOfTheDayController);
  });
  
  it('should be defined', () => {
    expect(controller).toBeDefined();
    
  });
});
