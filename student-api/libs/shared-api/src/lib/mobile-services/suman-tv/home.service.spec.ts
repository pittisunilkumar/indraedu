import { Test, TestingModule } from '@nestjs/testing';
import { MobileSumanTvHomeService } from './home.service';

describe('MobileHomeService', () => {
  let service: MobileSumanTvHomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MobileSumanTvHomeService],
    }).compile();

    service = module.get<MobileSumanTvHomeService>(MobileSumanTvHomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
