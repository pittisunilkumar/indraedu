import { AuthModule } from '@application/auth';
import { FacultySchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacultyController } from './faculty.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Faculty',
        schema: FacultySchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [FacultyController],
})
export class FacultyModule {}
