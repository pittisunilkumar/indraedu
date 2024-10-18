import { Test, TestingModule } from '@nestjs/testing';
import { RoleValuesController } from './role-values.controller';

describe('Banners Controller', () => {
  let controller: RoleValuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleValuesController],
    }).compile();

    controller = module.get<RoleValuesController>(RoleValuesController);
  });
  
  it('should be defined', () => {
    expect(controller).toBeDefined();
    
  });
});
