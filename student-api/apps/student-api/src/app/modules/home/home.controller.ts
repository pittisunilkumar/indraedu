import { JwtAuthGuard } from '@application/auth';
import {
  ApiResponseInterface,
  Banner,
  HomePageCourseInterface,
  MobileHomeService,
  Test,
  Video,
  VideosService,
} from '@application/shared-api';
import {
  Request,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('home')
export class HomeController {
  constructor(private homeService: MobileHomeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('dashboard')
  @ApiOperation({ summary: 'Fetch Home Screen Data' })
  @ApiResponse({
    status: 200,
    description: 'Data Fetched Successfully',
    type: () => {
      return {
        banners: [Banner],
        suggested: { test: [Test], videos: [Video] },
      };
    },
  })
  async getHomePageData(
    @Request() request,
    @Body() body: any
  ): Promise<ApiResponseInterface> {
    var data = await this.homeService.getData(request, body);

    return {
      status: data.status,
      code: data.code,
      message: data.message,
      data: data.data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('UpdateUserSubscription')
  @ApiOperation({ summary: 'Fetch Home Screen Data' })
  @ApiResponse({
    status: 200,
    description: 'Data Fetched Successfully',
    type: () => {
      return {
        banners: [Banner],
        suggested: { test: [Test], videos: [Video] },
      };
    },
  })
  async UpdateUserSubscription(
    @Request() request,
    @Body() body: any
  ): Promise<any> {
    var data = await this.homeService.UpdateUserSubscription(request, body);

    return {
      status: data.status,
      code: data.code,
      message: data.message,
      data: data.data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('courseList')
  @ApiOperation({ summary: 'Fetch All Courses Data' })
  @ApiResponse({
    status: 200,
    description: 'courses Data Fetched Successfully',
    type: () => {
      return [];
    },
  })
  async getAllCourses(
    @Request() request,
    @Query('application') application: string
  ): Promise<ApiResponseInterface> {
    return this.homeService.findAllCourses(request, application);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('userlist')
  @ApiOperation({ summary: 'Fetch All Courses Data' })
  @ApiResponse({
    status: 200,
    description: 'courses Data Fetched Successfully',
    type: () => {
      return [];
    },
  })
  async getUserlist(
    @Request() request,
    @Query('application') application: string
  ): Promise<ApiResponseInterface> {
    return this.homeService.getUserlist(request, application);
  }

  @UseGuards(JwtAuthGuard)
  @Post('banners')
  async getBannersBycourseId(@Body() body: any) {
    if (body.courseId) {
      var data = await this.homeService.getBannersByCourseId(body.courseId);
      if (data.length) {
        return {
          status: true,
          code: 2000,
          message: 'Banners Fetched',
          data: data,
        };
      } else {
        return {
          status: false,
          code: 2001,
          message: 'courseId Required',
          data: [],
        };
      }
    } else {
      return {
        status: false,
        code: 2001,
        message: 'courseId Required',
        data: [],
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('updateSuggestedVideoStatus')
  async updateSuggestedVideoStatus(@Request() req, @Body() payload) {
    if (payload.videoUuid) {
      var chapters = await this.homeService.updateSuggestedVideoStatus(
        req,
        payload
      );
      return {
        status: true,
        code: 2000,
        message: 'Video Status Updated',
        data: chapters,
      };
    } else {
      return {
        status: false,
        code: 2001,
        message: 'videoUuid Required',
        data: {},
      };
    }
  }
  @UseGuards(JwtAuthGuard)
  @Post('check-subscription-status')
  async checkCubscriptionStatus(@Request() req, @Body() payload) {
    if (payload.type) {
      var chapters = await this.homeService.checkCubscriptionStatus(
        req,
        payload
      );
      return {
        status: true,
        code: 2000,
        message: payload.type + ' Status Fetched',
        data: chapters,
      };
    } else {
      return { status: false, code: 2001, message: 'Type Required', data: {} };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('course-groups')
  @ApiOperation({ summary: 'Fetch All Groups Data' })
  @ApiResponse({
    status: 200,
    description: 'Groups Data Fetched Successfully',
    type: () => {
      return [];
    },
  })
  async getGroups(
    @Request() request,
    @Query('application') application: string
  ): Promise<ApiResponseInterface> {
    return this.homeService.getGroups(request, application);
  }

  @UseGuards(JwtAuthGuard)
  @Get('course-group/:id')
  @ApiOperation({ summary: 'Fetch All Group Data' })
  @ApiResponse({
    status: 200,
    description: 'Group  Data Fetched Successfully',
    type: () => {
      return [];
    },
  })
  async getGroup(
    @Request() request,
    @Param('id') id: string
  ): Promise<ApiResponseInterface> {
    return this.homeService.getGroup(request, id);
  }
}
