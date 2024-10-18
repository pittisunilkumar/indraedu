import { SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { VideoCipherController } from './video-cipher.controller';

@Module({
  imports: [
    SharedApiModule,
  ],
  controllers: [VideoCipherController]
})
export class VideoCipherModule {}
