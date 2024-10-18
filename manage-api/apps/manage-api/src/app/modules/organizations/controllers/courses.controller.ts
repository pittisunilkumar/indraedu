import { CourseInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import { CreateCourseDTO } from '@application/shared-api';
import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CoursesService } from '../services';

@Controller('organizations')
export class CoursesController {
  constructor(private courseService: CoursesService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post(':orgUuid/courses')
  async createCourse(
    @Param('orgUuid')
    orgUuid: string,
    @Body() createCourseDto: CreateCourseDTO
  ) {
    return this.courseService.addCourseByOrgUuid(orgUuid, createCourseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':orgUuid/courses/:courseUuid')
  deleteByUuid(
    @Param('uuid')
    uuid: string,
    @Param('courseUuid')
    courseUuid: string
  ) {
    return this.courseService.deleteCourseByUuid(uuid, courseUuid);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':orgUuid/courses/:courseUuid')
  editByUuid(
    @Param('uuid')
    uuid: string,
    @Param('courseUuid')
    courseUuid: string,
    @Body() course: CourseInterface
  ) {
    return this.courseService.editCourseByUuid(uuid, courseUuid, course);
  }
}
