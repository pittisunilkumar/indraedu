import { JwtAuthGuard } from '@application/auth';
import { MobilePearlsService,MobilePearlsSubjectsService, VideoSubjectsInterface } from '@application/shared-api';
import { Controller, Request, Get, Param, UseGuards,Body,Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('pearls')
export class PearlsController {

  constructor(private pearlsSubjectsService: MobilePearlsSubjectsService,private pearlsService: MobilePearlsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('subjects')
  async subjects(@Body() payload) {

    var data =  await this.pearlsSubjectsService.getSubjects(payload);
    return { "status": true, "code": 2000, 'message': 'Subjects Fetched', 'data': data }
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-pearls-by-subject')
  async getpearlsBySubject(@Request() req, @Body() payload) {

    var data =  await this.pearlsSubjectsService.getpearlsBySubject(req,payload);
    return { "status": true, "code": 2000, 'message': 'Subjects Fetched', 'data': data }
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-pearl-questions-by-id')
  async getpearlById(@Request() req, @Body() payload) {

    var data =  await this.pearlsSubjectsService.getpearlById(req, payload);
    return { "status": true, "code": 2000, 'message': 'Subjects Fetched', 'data': data }
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-book-mark')
  async addBookMark(@Request() req, @Body() payload) {

    var data =  await this.pearlsSubjectsService.addBookMark(req,payload);
    return { "status": true, "code": 2000, 'message': 'Subjects Fetched', 'data': data }
  }

  @UseGuards(JwtAuthGuard)
  @Post('remove-book-mark')
  async removeBookMark(@Request() req, @Body() payload) {

    var data =  await this.pearlsSubjectsService.removeBookMark(req,payload);
    return { "status": true, "code": 2000, 'message': 'Subjects Fetched', 'data': data }
  }
}
