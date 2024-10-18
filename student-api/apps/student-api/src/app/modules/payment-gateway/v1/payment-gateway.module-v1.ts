import { AuthModule } from '@application/auth';
import { UserTransactionsSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentGatewayControllerV1 } from './payment-gateway.controller-v1';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'PaymentGateway',
        schema: UserTransactionsSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [PaymentGatewayControllerV1],
})
export class PaymentGatewayModuleV1 {}
