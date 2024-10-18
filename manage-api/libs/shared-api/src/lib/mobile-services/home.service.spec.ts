import { Test, TestingModule } from '@nestjs/testing';
import { MobileHomeService } from './home.service';

describe('MobileHomeService', () => {
  let service: MobileHomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MobileHomeService],
    }).compile();

    service = module.get<MobileHomeService>(MobileHomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
