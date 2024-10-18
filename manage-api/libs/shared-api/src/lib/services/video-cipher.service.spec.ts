import { Test, TestingModule } from '@nestjs/testing';
import { VideoCipherService } from './video-cipher.service';

describe('VideoCipherService', () => {
  let service: VideoCipherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoCipherService],
    }).compile();

    service = module.get<VideoCipherService>(VideoCipherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
