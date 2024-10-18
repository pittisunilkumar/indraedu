import type { QBankInterface, VideoPlaybackInfoInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import { ApiResponseInterface, MobileVideoSubjectService, VideoSubject } from '@application/shared-api';
import { Request, Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, CacheKey, CacheTTL } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Controller('videos')
export class VideoSubjectsController {

  constructor(private videoSubjectsService: MobileVideoSubjectService) { }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch QBanks by Course Id' })
  @ApiResponse({
    status: 200,
    description: 'QBanks Fetched Successfully',
    type: [VideoSubject],
  })
  @CacheKey('subjects/byCourseId')
  @CacheTTL(120)
  @Post('subjects/byCourseId')
  async findByCourse(@Request() req, @Body() body): Promise<ApiResponseInterface> {
    try {
      if (body.courseId) {
        return this.videoSubjectsService.findByCourse(req, body);
        // //  return data;
        // return {
        //   "status": data.status,
        //   "code": data.code,
        //   "message": data.message,
        //   'data': data.data
        // }
      } else {
        return {
          "status": false,
          "code": 2001,
          "message": "Course Id Required",
          'data': []
        }
      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('subjects/chapters')
  async findChaptersBySubjectId(
    @Request() req, @Body() body
  ) {
    try {
      if (body.subjectId) {
        var chapters = await this.videoSubjectsService.findChaptersBySubjectId(req, body);
        return {
          "status": true,
          "code": 2000,
          "message": "Subjects Fetched",
          'data': chapters
        }
      } else {
        return {
          "status": false,
          "code": 2001,
          "message": "Subject Uuid Required",
          'data': {}
        }
      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('getVideo')
  async findOne(
    @Request() req, @Body() body
  ) {
    try {
      if (body.videoUuid) {
        var chapters = await this.videoSubjectsService.findVideosByUuid(req, body.videoUuid);
        return {
          "status": true,
          "code": 2000,
          "message": "Video Fetched",
          'data': chapters
        }
      } else {
        return { "status": false, "code": 2001, "message": "videoUuid Required", 'data': {} }
      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('playbackInfo')
  getPlaybackInfo(
    @Request() req,
    @Body() payload: VideoPlaybackInfoInterface
  ) {

    return this.videoSubjectsService.getPlaybackInfo(req, payload);

  }
  @UseGuards(JwtAuthGuard)
  @Post('offlineplaybackInfo')
  async getofflinePlaybackInfo(
    @Request() req,
    @Body() payload: VideoPlaybackInfoInterface
  ) {
    try {
      var chapters = await this.videoSubjectsService.getofflinePlaybackInfo(req, payload);
      return {
        "status": true,
        "code": 2000,
        "message": "Video Offline Otp",
        'data': chapters
      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('updateVideoStatus')
  async updateVideoStatus(
    @Request() req, @Body() payload
  ) {
    try {
      if (payload.videoUuid) {
        var chapters = await this.videoSubjectsService.updateVideoStatus(req, payload);
        return {
          "status": true,
          "code": 2000,
          "message": "Video Status Updated",
          'data': chapters
        }
      } else {
        return { "status": false, "code": 2001, "message": "videoUuid Required", 'data': {} }
      }

    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

}
