import { Test, TestingModule } from '@nestjs/testing';
import { RoleSubModulesService } from './role-submodules.service';

describe('RoleSubModulesService', () => {
  let service: RoleSubModulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleSubModulesService],
    }).compile();

    service = module.get<RoleSubModulesService>(RoleSubModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
