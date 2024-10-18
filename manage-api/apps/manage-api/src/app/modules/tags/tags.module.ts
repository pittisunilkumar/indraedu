import { AuthModule } from '@application/auth';
import { TagsSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsController } from './tags.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Tags',
        schema: TagsSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [TagsController],
})
export class TagsModule {}
