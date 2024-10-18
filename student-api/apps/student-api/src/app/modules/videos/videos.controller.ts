import {
  VideoInterface,
} from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  Banner,
  CreateVideoDTO,
  MobileVideosService,
  Test,
  Video,
  VideosService,
  VideoSubjectsInterface,
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
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('video')
export class VideosController {

  constructor(private videosService: MobileVideosService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch Videos' })
  @ApiResponse({
    status: 200,
    description: 'Video Subjects by Course ID list Fetched Successfully',
    type: [Video],
  })
  @Get(':id/subjectsByCourseID')
  async findVideoSubjectsByCourseId(@Param('id') courseid: string): Promise<VideoSubjectsInterface[]> {
    return this.videosService.getVideoSubjectsByCourseId(courseid)
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch Videos by Subject ID' })
  @ApiResponse({
    status: 200,
    description: 'Videos list Fetched Successfully',
    type: [Video],
  })
  @Get('bySubjectId/:subjectId')
  async findVideoBySubjectId(@Param('subjectId') subjectId: string) {
    return this.videosService.getSubjectVideos(subjectId)
  }

  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: 'Fetch Video' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Data Fetched Successfully',
  //   type: Video,
  // })
  // @Get(':uuid')
  // findOne(
  //   @Param('uuid')
  //   uuid: string
  // ) {
  //   return this.videosService.findByUuid(uuid);
  // }

}
