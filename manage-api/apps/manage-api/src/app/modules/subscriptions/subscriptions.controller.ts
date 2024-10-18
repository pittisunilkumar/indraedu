import { SubscriptionInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import { CreateSubscriptionDto, Subscription, SubscriptionService } from '@application/shared-api';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards,Request } from '@nestjs/common';

@Controller('subscriptions')
export class SubscriptionsController {

  constructor(
    private subscriptionService: SubscriptionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async add(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() request): Promise<Subscription[]> {
    const employee = request.user;

    return this.subscriptionService.findAll(employee);
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':subUuid')
  findOne(
    @Param('subUuid')
    subUuid: string
  ) {
    return this.subscriptionService.findByUuid(subUuid);
  }

  @UseGuards(JwtAuthGuard)
  @Get('edit/:subUuid')
  editSubscription(
    @Param('subUuid')
    subUuid: string
  ) {
    return this.subscriptionService.editSubscription(subUuid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':subUuid')
  deleteByUuid(
    @Param('subUuid')
    subUuid: string
  ) {
    return this.subscriptionService.deleteByUuid(subUuid);
  }

  // @UseGuards(JwtAuthGuard)
  @Put('update/:subUuid')
  editByUuid(
    @Param('subUuid')
    subUuid: string,
    @Body() sub: any
  ) {
    return this.subscriptionService.editSubscriptionByUuid(subUuid, sub);
  }

  @Get('sub/getSubcriptionsGreaterToday')
  async getSubcriptionsGreaterToday() : Promise<Subscription[]>  {
    return this.subscriptionService.getSubcriptionsGreaterToday();
  }

  @Get('sub/couponSubscriptions')
  async couponSubscriptions() : Promise<Subscription[]>  {
    return this.subscriptionService.couponSubscriptions();
  }
  

  @Get('courses/:id')
  async findByCourse(@Param('id') courseId: string): Promise<Subscription[]> {
    return this.subscriptionService.findByCourse(courseId);
  }

}
