import { AuthModule } from '@application/auth';
import { SuggestedVideosSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuggestedVideosController } from './suggested-videos.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'SuggestedVideos',
        schema: SuggestedVideosSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [SuggestedVideosController],
})
export class SuggestedVideosModule {}
