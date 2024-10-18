import { SubscriptionInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  CreateSubscriptionDto,
  MobileSubscriptionService,
  Subscription,
} from '@application/shared-api';
import {
  Request,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionService: MobileSubscriptionService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    try {
      var data = await this.subscriptionService.findAll();
      return {
        status: false,
        code: 2001,
        message: 'Subscriptions Fetched',
        data: data,
      };
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('by-course-id')
  async getSubscriptionsByCourse(@Request() req, @Body() body) {
    try {
      if (body.courseId) {
        var data = await this.subscriptionService.getSubscriptionsByCourse(
          req,
          body
        );
        return {
          status: true,
          code: 2000,
          message: 'Subscription Fetched',
          data: data,
        };
      } else {
        return {
          status: false,
          code: 2001,
          message: 'Course Id Required',
          data: {},
        };
      }
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('by-id')
  async getSingleSubscription(@Request() req, @Body() body) {
    try {
      if (body.subscriptionId) {
        var data = await this.subscriptionService.findById(req, body);
        return {
          status: true,
          code: 2000,
          message: 'Subscription Fetched',
          data: data,
        };
      } else {
        return {
          status: false,
          code: 2001,
          message: 'Subscription Id Required',
          data: {},
        };
      }
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':subUuid')
  findOne(
    @Param('subUuid')
    subUuid: string,
    @Query() query
  ) {
    return this.subscriptionService.findByUuid(subUuid, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('apply-coupon')
  async applyCoupon(@Request() req, @Body() body) {
    try {
      if (body.subscriptionId) {
        if (body.couponCode) {
          var data = await this.subscriptionService.applyCoupon(req, body);
          return {
            status: data.status,
            code: data.code,
            message: data.message,
            data: data.data,
          };
        } else {
          return {
            status: false,
            code: 2001,
            message: 'CouponCode Required',
            data: {},
          };
        }
      } else {
        return {
          status: false,
          code: 2001,
          message: 'Subscription Id Required',
          data: {},
        };
      }
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-groups/:id')
  async getSubscriptionsByGroup(
    @Param('id')
    id: string,
    @Request() req
  ) {
    try {
      if (id) {
        var data = await this.subscriptionService.getSubscriptionsByGroup(
          req,
          id
        );
        return {
          status: true,
          code: 2000,
          message: 'Subscription Fetched',
          data: data,
        };
      } else {
        return {
          status: false,
          code: 2001,
          message: 'Group Id Required',
          data: {},
        };
      }
    } catch (error) {
      return { status: false, code: 5000, message: 'Server error', data: {} };
    }
  }
}
