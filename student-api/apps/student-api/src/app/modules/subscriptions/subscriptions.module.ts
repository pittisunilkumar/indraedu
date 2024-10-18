import { AuthModule } from '@application/auth';
import { SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';

@Module({
  imports: [
    SharedApiModule,
    AuthModule,
  ],
  controllers: [SubscriptionsController]
})
export class StudentsSubscriptionsModule {}
