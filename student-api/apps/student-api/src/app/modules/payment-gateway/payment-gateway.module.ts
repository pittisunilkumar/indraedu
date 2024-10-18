import { AuthModule } from '@application/auth';
import { UserTransactionsSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentGatewayController } from './payment-gateway.controller';

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
  controllers: [PaymentGatewayController],
})
export class PaymentGatewayModule {}
