import { BannerInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  Banner,
  SuggestedVideosService,
  CreateSuggestedVideoDto,
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

@Controller('suggestedvideos')
export class SuggestedVideosController {

    constructor(private suggestedVideosService: SuggestedVideosService) {}

  //@UseGuards(JwtAuthGuard)
  @Post()
  async add(@Body() createSuggestedVideoDto: CreateSuggestedVideoDto) {
    return this.suggestedVideosService.create(createSuggestedVideoDto);
  }

  @Get()
  async findAll(){
    return this.suggestedVideosService.findAll();
  }

  @Put('status/:id')
  async updateStatus(
    @Param('id')
    id: string,
    @Body() status: any
  ){
    return this.suggestedVideosService.updateStatus(id,status);
  }

  @Delete('courseId')
  deleteByUuid(
    @Body() courseId: any
  ) {
    return this.suggestedVideosService.deleteByCourse(courseId);
  }



}