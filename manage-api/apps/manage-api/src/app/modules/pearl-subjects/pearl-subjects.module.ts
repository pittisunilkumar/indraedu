import { AuthModule } from '@application/auth';
import { PearlsSchema, PearlSubjectsSchema,SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PearlSubjectsController } from './pearl-subjects.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'PearlSubjects',
        schema: PearlSubjectsSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [PearlSubjectsController],
})
export class PearlSubjectsModule {}
