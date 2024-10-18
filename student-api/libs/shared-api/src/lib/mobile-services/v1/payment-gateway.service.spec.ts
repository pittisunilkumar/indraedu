import { Test, TestingModule } from '@nestjs/testing';
import { PaymentGatewayServiceV1 } from './payment-gateway.service';

describe('PaymentGatewayService', () => {
  let service: PaymentGatewayServiceV1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentGatewayServiceV1],
    }).compile();

    service = module.get<PaymentGatewayServiceV1>(PaymentGatewayServiceV1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
