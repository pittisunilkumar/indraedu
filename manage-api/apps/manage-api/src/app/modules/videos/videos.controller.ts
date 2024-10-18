import type {
  VideoInterface,
} from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  CreateVideoDTO,
  Video,
  VideosService,
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
@Controller()
export class VideosController {

  constructor(
    private videosService: VideosService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('videos/subjects/:uuid/video')
  @ApiOperation({ summary: 'Create Video' })
  @ApiResponse({
    status: 200,
    description: 'Video Created Successfully',
    type: Video,
  })
  async createVideo(@Body() createVideoDto: CreateVideoDTO) {
    return this.videosService.addSubjectVideo(createVideoDto);
  }

  @Post('videos/subjects/bulkVideos')
  async createBulkTopics(@Body() response: any) {
    return this.videosService.createBulkVideos(response);
  }

  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch Video' })
  @ApiResponse({
    status: 200,
    description: 'Video Fetched Successfully',
    type: null,
  })
  @Get('videos/subjects/:uuid/chapter/:chapterUuid/videos/:videoUuid/:course')
  videoByUuid(
    @Param('uuid')
    subjectUuid: string,
    @Param('chapterUuid')
    chapterUuid: string,
    @Param('videoUuid')
    videoUuid: string,
    @Param('course')
    course: string
  ) {
    return this.videosService.findByUuid(subjectUuid,chapterUuid, videoUuid, course);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete Video' })
  @ApiResponse({
    status: 200,
    description: 'Video Deleted Successfully',
    type: null,
  })
  @Delete('videos/subjects/:uuid/videos/:videoUuid')
  deleteByUuid(
    @Param('uuid')
    subjectUuid: string,
    @Param('videoUuid')
    videoUuid: string,
  ) {
    return this.videosService.deleteByUuid(subjectUuid, videoUuid);
  }
  @Post('videos/subjects/updateVideos')
  editVideoByUuid(
    @Body() video: VideoInterface
  ) {
    return this.videosService.editVideoByUuid( video);
  }

  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: 'Update Video' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Video Updated Successfully',
  //   type: null,
  // })

  // @Post('videos/subjects/updateVideos')
  // editVideoByUuid(
  //   @Body() video: any
  // ) {
  //   return this.videosService.editVideoByUuid( video);
  // }


}
