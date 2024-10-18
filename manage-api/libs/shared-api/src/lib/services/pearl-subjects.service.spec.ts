import { Test, TestingModule } from '@nestjs/testing';
import { PearlSubjectsService } from './pearl-subjects.service';

describe('PearlSubjectsService', () => {
  let service: PearlSubjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PearlSubjectsService],
    }).compile();

    service = module.get<PearlSubjectsService>(PearlSubjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
