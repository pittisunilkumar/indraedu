import { AuthModule } from '@application/auth';
import { SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';

@Module({
  imports: [SharedApiModule, AuthModule],
  controllers: [FeedbackController],
  providers: [],
})
export class PortalFeedbackModule {}
