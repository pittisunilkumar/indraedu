import { TransactionsDateInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  UserTransactions,
  UserTransactionsService,
  CreateUserTransactionsDTO
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

@Controller('usertransactions')
export class UserTransactionsController {
  constructor(private userTransactionsService: UserTransactionsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async add(@Body() createUserTransactionsDto: CreateUserTransactionsDTO) {
    //console.log('createUserTransactionsDto',createUserTransactionsDto);

    return this.userTransactionsService.create(createUserTransactionsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transactions')
  async findAll(@Request() request): Promise<UserTransactions[]> {
    const employee = request.user;

    return this.userTransactionsService.getUserTransactions(employee);
  }

  @UseGuards(JwtAuthGuard)
  @Post('searchDateFilter')
  async getTransactionsDateFilter(@Body() transactionsInterface: TransactionsDateInterface, @Request() request) {

    const employee = request.user;

    return this.userTransactionsService.getTransactionsDateFilter(transactionsInterface, employee);
  }

  @Get('masterAdviceTransactions')
  async getMasterAdviceTransactions() {
    return this.userTransactionsService.getMasterAdviceTransactions();
  }

  @Post('masterAdvice/searchDateFilters')
  async getmasterAdviceDateFilter(@Body() transactionsInterface: TransactionsDateInterface) {

    return this.userTransactionsService.getmasterAdviceDateFilter(transactionsInterface);
  }

  @Get(':uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    return this.userTransactionsService.findByUuid(uuid);
  }

  @Get('subscription/:id')
  assignedSubscriptions(
    @Param('id')
    id: any
  ) {
    return this.userTransactionsService.assignedSubscriptions(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('year/payments')
  yearlyPayments(@Body() payload: any, @Request() request) {
    const employee = request.user;
    return this.userTransactionsService.yearlyPayments(payload, employee);
  }

  @UseGuards(JwtAuthGuard)
  @Get('week/payments')
  weeklyPayments(@Request() request) {
    const employee = request.user;
    return this.userTransactionsService.weeklyPayments(employee);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all/payments')
  paymentReports(@Request() request) {
    const employee = request.user;
    return this.userTransactionsService.paymentReports(employee);
  }
}
