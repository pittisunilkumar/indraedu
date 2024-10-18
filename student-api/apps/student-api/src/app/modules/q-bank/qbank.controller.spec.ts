import { Test, TestingModule } from '@nestjs/testing';
import { QBankController } from './qbank.controller';

describe('QBankController', () => {

  let controller: QBankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QBankController],
    }).compile();

    controller = module.get<QBankController>(QBankController);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

});
