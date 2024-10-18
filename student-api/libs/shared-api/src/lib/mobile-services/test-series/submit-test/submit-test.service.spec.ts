import { Test, TestingModule } from '@nestjs/testing';
import { SubmitTestService } from './submit-test.service';

describe('SubmitTestService', () => {
  let service: SubmitTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmitTestService],
    }).compile();

    service = module.get<SubmitTestService>(SubmitTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
