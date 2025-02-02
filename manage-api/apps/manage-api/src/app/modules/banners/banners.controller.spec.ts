import { Test, TestingModule } from '@nestjs/testing';
import { BannersController } from './banners.controller';

describe('Banners Controller', () => {
  let controller: BannersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BannersController],
    }).compile();

    controller = module.get<BannersController>(BannersController);
  });
  
  it('should be defined', () => {
    expect(controller).toBeDefined();
    
  });
});
