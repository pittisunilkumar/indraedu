import { JwtAuthGuard } from '@application/auth';
import { MobileVideosService, VideoSubjectsInterface } from '@application/shared-api';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('courses')
export class CoursesController {

  constructor(private videosService: MobileVideosService) {}



}
