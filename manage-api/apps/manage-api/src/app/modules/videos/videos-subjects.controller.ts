import type{ VideoInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import { CreateVideoSubjectDto, VideoSubject, VideoSubjectService } from '@application/shared-api';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class VideosSubjectController {

  constructor(
    private videoSubjectService: VideoSubjectService
  ) {}

  // @UseGuards(JwtAuthGuard)
  @Post('videos/subjects')
  async createSubject(@Body() createVideoSubjectDTO: CreateVideoSubjectDto) {
    return this.videoSubjectService.create(createVideoSubjectDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Get('videos/subjects')
  async findAll(@Request() request): Promise<VideoSubject[]> {
    const employee = request.user;
    return this.videoSubjectService.findAll(employee);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('videos/subjects/:uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    return this.videoSubjectService.findByUuid(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch Video Subjects by Course Id' })
  @ApiResponse({
    status: 200,
    description: 'Video Subjects Fetched Successfully',
    type: [VideoSubject],
  })
  @Get('videos/subjects/courses/:id')
  async findByCourse(@Param('id') courseId: string): Promise<VideoSubject[]> {
    return this.videoSubjectService.findByCourse(courseId);
  }

  @Post('videos/subjects/subjectsByCourseIds')
  async findSubjectsByCoueseId( @Body() coursesarr: any) {
    return this.videoSubjectService.findSubjectsByCoueseIds(coursesarr);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('videos/subjects/:uuid')
  deleteByUuid(
    @Param('uuid')
    uuid: string
  ) {
    return this.videoSubjectService.deleteByUuid(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Put('videos/subjects/:videoSubjectUuid')
  editByUuid(
    //@Param('videoSubjectUuid')
    //uuid: string,
    @Body() video: VideoInterface
  ) {
    return this.videoSubjectService.editByUuid( video);
  }

  @Post('videos/subjects/copyVideos')
  async copyVideos(
    @Body() videos: VideoInterface) {
    return this.videoSubjectService.copyVideos(videos);
  }

  @Post('videos/subjects/copychapters')
  async copyVideosChapters(
    @Body() chapters: VideoInterface) {
    return this.videoSubjectService.copyVideosChapters(chapters);
  }


  @Post('videos/subjects/moveVideos')
  moveVideos(
    // @Param('uuid')
    // uuid: string,
    @Body() movevideos: VideoInterface
  ) {
    return this.videoSubjectService.moveVideos(movevideos);
  }

  @Post('videos/subjects/moveChapters')
  moveVideoChapters(
    // @Param('uuid')
    // uuid: string,
    @Body() movevideochaptrers: VideoInterface
  ) {
    return this.videoSubjectService.moveVideoChapters(movevideochaptrers);
  }

  @Post('videos/subjects/deleteChapters')
  async deleteVideoChapters(
    @Body() videochapters: VideoInterface) {
    return this.videoSubjectService.deleteVideoChapters(videochapters);
  }

  @Post('videos/subjects/deleteVideos')
  async deleteMultipleTopics(@Body() videochapters: VideoInterface) {
    return this.videoSubjectService.deleteMultipleVideos(videochapters);
  }


  @Post('videos/subjects/dragAndDropVideos')
  dragAndDropVideos(
    // @Param('uuid')
    // uuid: string,
    @Body() dragAndDropVideos: any
  ) {
    return this.videoSubjectService.dragAndDropVideos(dragAndDropVideos);
  }

  @Post('videos/subjects/dragAndDropVideoChapters')
  dragAndDropChapters(
    // @Param('uuid')
    // uuid: string,
    @Body() dragAndDropChapters: any
  ) {
    return this.videoSubjectService.dragAndDropChapters(dragAndDropChapters);
  }

  @Post('videos/subjects/dragAndDropSubjects')
  dragAndDropSubjects(
    // @Param('uuid')
    // uuid: string,
    @Body() dragAndDropSubjects: any
  ) {
    return this.videoSubjectService.dragAndDropSubjects(dragAndDropSubjects);
  }

  

}
