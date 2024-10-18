import { Test, TestingModule } from '@nestjs/testing';
import { MobileSubscriptionService } from './subscription.service';

describe('MobileSubscriptionService', () => {
  let service: MobileSubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MobileSubscriptionService],
    }).compile();

    service = module.get<MobileSubscriptionService>(MobileSubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
