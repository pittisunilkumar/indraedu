import { TransactionsDateInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  AgentTransactionsService,
  CreateAgentTransactionsDTO,
  AgentTransactions
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

@Controller('agentTransactions')
export class AgentTransactionsController {
    constructor(private agentTransactionsService: AgentTransactionsService) {}

    //@UseGuards(JwtAuthGuard)
    @Post()
    async add(@Body() createAgentTransactionsDto: CreateAgentTransactionsDTO) {
      return this.agentTransactionsService.create(createAgentTransactionsDto);
    }

    @Get()
    async findAll() :Promise<AgentTransactions[]> {

      return this.agentTransactionsService.getAgentTransactions();
    }

    @Post('searchDateFilter')
    async getTransactionsDateFilter( @Body() transactionsInterface: TransactionsDateInterface){

      return this.agentTransactionsService.getTransactionsDateFilter(transactionsInterface);
    }

    @Get('agent/:id')
    getAgentTransations(
      @Param('id')
      id: string
    ) {
      return this.agentTransactionsService.AgentTransationsByUuid(id);
    }

    @Get(':uuid')
    findOne(
      @Param('uuid')
      uuid: string
    ) {
      return this.agentTransactionsService.findByUuid(uuid);
    }
}
