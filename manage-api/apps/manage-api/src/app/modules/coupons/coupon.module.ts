import { AuthModule } from '@application/auth';
import { CouponSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponController } from './coupon.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Coupon',
        schema: CouponSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [CouponController],
})
export class CouponsModule {}
