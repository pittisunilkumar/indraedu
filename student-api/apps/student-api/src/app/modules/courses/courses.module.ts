import { AuthModule } from '@application/auth';
import { SharedApiModule } from '@application/shared-api';
import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';

@Module({
  imports: [SharedApiModule, AuthModule],
  providers: [],
  controllers: [CoursesController]
})
export class StudentCoursesModule {}
