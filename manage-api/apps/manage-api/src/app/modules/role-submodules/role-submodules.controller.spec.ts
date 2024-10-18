import { Test, TestingModule } from '@nestjs/testing';
import { RoleSubModulesController } from './role-submodules.controller';

describe('Banners Controller', () => {
  let controller: RoleSubModulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleSubModulesController],
    }).compile();

    controller = module.get<RoleSubModulesController>(RoleSubModulesController);
  });
  
  it('should be defined', () => {
    expect(controller).toBeDefined();
    
  });
});
