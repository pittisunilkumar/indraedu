import { CouponInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  Coupon,
  CouponsService,
  CreateCouponDTO,
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
  Request
} from '@nestjs/common';

@Controller('coupons')
export class CouponController {

  constructor(
    private couponsService: CouponsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async add(@Body() createCouponDto: CreateCouponDTO) {

    return this.couponsService.create(createCouponDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() request) {
      const employee = request.user;
    return this.couponsService.findAll(employee);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':couponUuid')
  findOne(
    @Param('couponUuid')
    couponUuid: string
  ) {
    return this.couponsService.findByUuid(couponUuid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':couponUuid')
  deleteByUuid(
    @Param('couponUuid')
    couponUuid: string
  ) {
    return this.couponsService.deleteByUuid(couponUuid);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':couponUuid')
  editByUuid(
    @Param('couponUuid')
    couponUuid: string,
    @Body() coupon: CouponInterface
  ) {
    return this.couponsService.editCouponByUuid(couponUuid, coupon);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('getCouponsByAgentId/:agentId')
  getCouponsByAgentId(
    @Param('agentId')
    agentId: string
  ) {
    return this.couponsService.getCouponsByAgentId(agentId);
  }
}
