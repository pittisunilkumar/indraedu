import { AuthModule } from '@application/auth';
import { SharedApiModule, VideoSchema, VideoSubjectSchema } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoSubjectsController } from './video-subjects.controller';
import { VideosController } from './videos.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Video',
        schema: VideoSchema,
      },
      {
        name: 'VideoSubject',
        schema: VideoSubjectSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [VideosController, VideoSubjectsController],
})
export class VideosModule {}
