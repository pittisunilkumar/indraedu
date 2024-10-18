import { ApiKeyAuthGuard, JwtAuthGuard } from '@application/auth';
import {
  ApiResponseInterface,
  Course,
  MobileSumanTvHomeService,
} from '@application/shared-api';
import { CacheInterceptor, CacheKey, CacheTTL, Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(ApiKeyAuthGuard)
@Controller('integration')
@UseInterceptors(CacheInterceptor)
export class SumanTvController {
  constructor(private homeService: MobileSumanTvHomeService) {}

  @ApiOperation({ summary: 'Fetch Courses' })
  @ApiResponse({
    status: 200,
    description: 'Course list',
    type: [Course],
  })
  @Get('course')
  @CacheKey('GET_COURSE_CACHE')
  @CacheTTL(120)
  async getCourseList(): Promise<ApiResponseInterface> {
    return this.homeService.findAllCourses();
  }
}
