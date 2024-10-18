import { BannerInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  Banner,
  MCQOfTheDayService,
  CreateMCQOfTheDayDto,
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

@Controller('mcqoftheday')
export class MCQOfTheDayController {

    constructor(private mCQOfTheDayService: MCQOfTheDayService) {}

  //@UseGuards(JwtAuthGuard)
  @Post()
  async add(@Body() createMCQOfTheDayDto: CreateMCQOfTheDayDto) {
    return this.mCQOfTheDayService.create(createMCQOfTheDayDto);
  }

  @Get()
  async getMCQs() {
    return this.mCQOfTheDayService.getMCQs();
  }

  @Put('status/:id')
  async updateStatus(
    @Param('id')
    id: string,
    @Body() status: any
  ){
    return this.mCQOfTheDayService.updateStatus(id,status);
  }

  @Get('update-mcq-of-the-day')
  async updateMcqOfTheDay() {
    return this.mCQOfTheDayService.updateMcqOfTheDay();
  }

  @Get('send-push-notification-mcq-of-the-day')
  async sendPushNotificationMCQOfTheOfDay() {
    return this.mCQOfTheDayService.sendPushNotificationMCQOfTheOfDay();
  }



}