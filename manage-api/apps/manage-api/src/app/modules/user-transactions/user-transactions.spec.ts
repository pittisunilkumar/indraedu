import { Test, TestingModule } from '@nestjs/testing';
import { UserTransactionsController } from './user-transactions.controller';

describe('Banners Controller', () => {
  let controller: UserTransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTransactionsController],
    }).compile();

    controller = module.get<UserTransactionsController>(UserTransactionsController);
  });
  
  it('should be defined', () => {
    expect(controller).toBeDefined();
    
  });
});
