import { Test, TestingModule } from '@nestjs/testing';
import { RoleValuesService } from './role-values.service';

describe('RoleValuesService', () => {
  let service: RoleValuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleValuesService],
    }).compile();

    service = module.get<RoleValuesService>(RoleValuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
