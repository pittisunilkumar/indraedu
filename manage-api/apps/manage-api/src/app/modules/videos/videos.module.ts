import { AuthModule } from '@application/auth';
import { SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { VideosSubjectController } from './videos-subjects.controller';
import { VideosController } from './videos.controller';

@Module({
  imports: [
    SharedApiModule,
    AuthModule,
  ],
  controllers: [
    VideosSubjectController,
    VideosController,
  ],
})
export class VideosModule {}
