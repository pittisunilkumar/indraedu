import { AuthModule } from '@application/auth';
import { SharedApiModule, SyllabusSchema } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SyllabusController } from './syllabus.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Syllabus',
        schema: SyllabusSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [SyllabusController],
})
export class SyllabusModule {}
