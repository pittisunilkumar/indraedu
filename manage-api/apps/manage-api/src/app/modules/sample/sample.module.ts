import { AuthModule } from '@application/auth';
import { SampleSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SampleController } from './sample.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Sample',
        schema: SampleSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [SampleController],
})
export class SampleModule {}
