import { Test, TestingModule } from '@nestjs/testing';
import { SuggestedTestsController } from './suggested-tests.controller';

describe('SuggestedTests Controller', () => {
  let controller: SuggestedTestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuggestedTestsController],
    }).compile();

    controller = module.get<SuggestedTestsController>(SuggestedTestsController);
  });
  
  it('should be defined', () => {
    expect(controller).toBeDefined();
    
  });
});
