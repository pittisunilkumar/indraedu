import {
  CourseInterface,
  SyllabusInterface,
} from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  Course,
  CoursesService,
  CreateCourseDTO,
} from '@application/shared-api';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request
} from '@nestjs/common';
@Controller('courses')
export class CoursesController {

  constructor(private courseService: CoursesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCourse(@Body() createCourseDto: CreateCourseDTO) {
    return this.courseService.create(createCourseDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() request): Promise<Course[]> {
    const employee = request.user;
    return this.courseService.findAll(employee);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getActiveCourses')
  async getActiveCourses(@Request() request): Promise<Course[]> {
    const employee = request.user;
    return this.courseService.getActiveCourses(employee);
  }

  @Get('test-series/active')
  async getTestSeriesActiveCourses(): Promise<Course[]> {
    return this.courseService.getTestSeriesActiveCourses();
  }

  @UseGuards(JwtAuthGuard)
  @Get('byQBank')
  async findAllQBankCourses(): Promise<Course[]> {
    return this.courseService.findAllQBankCourses();
  }

  @UseGuards(JwtAuthGuard)
  @Get('byVideos')
  async findAllVideoCourses(): Promise<Course[]> {
    return this.courseService.findAllVideoCourses();
  }

  //@UseGuards(JwtAuthGuard)
  @Get(':uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    return this.courseService.findByUuid(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  deleteByUuid(
    @Param('uuid')
    uuid: string
  ) {
    return this.courseService.deleteByUuid(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':uuid')
  editByUuid(
    @Param('uuid')
    uuid: string,
    @Body() course: CourseInterface
  ) {
    return this.courseService.editCourseByUuid(course);
  }



  @Post('getTestSeriessubjects')
  async findTestSeriesSubjectsByCourse(@Body() request: any): Promise<Course[]> {

    return this.courseService.findTestSeriesSubjectsByCourse(request);
  }

  @Post('getqbanksubjects')
  async getqbanksubjects(@Body() request: any) : Promise<Course[]>{

    return this.courseService.getqbanksubjects(request);
  }
  @Post('getvideoubjects')
  async getVideosubjects(@Body() request: any) : Promise<Course[]>{

    return this.courseService.getVideosubjects(request);
  }
  @Post('getspqbanksubjects')
  async getspqbanksubjects(@Body() request: any) : Promise<Course[]>{

    return this.courseService.getspqbanksubjects(request);
  }

  @Post('getCouseSubjects')
  async getCouseSubjects(@Body() request: any){
    return this.courseService.getCouseSubjects(request);
  }
}
