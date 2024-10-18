import { Test, TestingModule } from '@nestjs/testing';
import { PaymentGatewayControllerV1 } from './payment-gateway.controller-v1';

describe('Banners Controller', () => {
  let controller: PaymentGatewayControllerV1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentGatewayControllerV1],
    }).compile();

    controller = module.get<PaymentGatewayControllerV1>(PaymentGatewayControllerV1);
  });
  
  it('should be defined', () => {
    expect(controller).toBeDefined();
    
  });
});
