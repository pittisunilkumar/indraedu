import { JwtAuthGuard } from '@application/auth';
import { NotificationService } from '@application/shared-api';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req, Res, Request
} from '@nestjs/common';
import * as uuid from 'uuid';

@Controller('notifiations')
export class NotificationsController {
  constructor(
    private _messagingService: NotificationService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('send-notification')
  async sendNotification(@Body() body, @Request() request): Promise<any> {
    const employee = request.user;

    try {
      var data = await this._messagingService.sendNotification(body, employee)
      return data;
    } catch (e) {
      return e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() request) {
    const employee = request.user;

    return this._messagingService.findAll(employee);
  }
  @Post('schedule-notification')
  async scheduleNotification(@Body() body): Promise<any> {
    try {
      var data = await this._messagingService.scheduleNotification(body)
      return data;
    } catch (e) {
      return e;
    }
  }

  @Get('send-schedule-notification')
  async sendScheduleNotification(@Body() body): Promise<any> {
    try {
      var data = await this._messagingService.sendScheduleNotification(body)
      return data;
    } catch (e) {
      return e;
    }
  }

  

  @Get('send-alert-expired-subscription')
  async sendAlertExpiredSubscription(@Body() body): Promise<any> {
    try {
      var data = await this._messagingService.sendAlertExpiredSubscription(body)
      return data;
    } catch (e) {
      return e;
    }
  }

  @Get('send-subscription-expire-alert')
  async sendSubscriptionExpireAlert(@Body() body): Promise<any> {
    try {
      var data = await this._messagingService.sendSubscriptionExpireAlert(body)
      return data;
    } catch (e) {
      return e;
    }
  }
  @Post('searchDateFilter')
  async getNotificationsDateFilter( @Body() transactionsInterface: any){

    return this._messagingService.getNotificationsDateFilter(transactionsInterface);
  }
  @Get('view-notification/:id')
  getNotificationById(
      @Param('id')
      id: string
  ) {
      return this._messagingService.getNotificationById(id);
  }


 
  @Delete(':id')
  deleteByUuid(
      @Param('id')
      id: string
  ) {
      return this._messagingService.deleteByUuid(id);
  }
}
