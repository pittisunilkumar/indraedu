import { Test, TestingModule } from '@nestjs/testing';
import { SuggestedQbankController } from './suggested-qbank.controller';

describe('SuggestedQbank Controller', () => {
  let controller: SuggestedQbankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuggestedQbankController],
    }).compile();

    controller = module.get<SuggestedQbankController>(SuggestedQbankController);
  });
  
  it('should be defined', () => {
    expect(controller).toBeDefined();
    
  });
});
