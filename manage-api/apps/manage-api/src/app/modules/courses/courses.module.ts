import { AuthModule } from '@application/auth';
import { CourseSchema, SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesController } from './courses.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Course',
        schema: CourseSchema,
      },
    ]),
    SharedApiModule,
    AuthModule,
  ],
  controllers: [CoursesController],
})
export class CoursesModule {}
