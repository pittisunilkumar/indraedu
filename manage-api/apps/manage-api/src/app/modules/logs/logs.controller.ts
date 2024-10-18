import { FacultyInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  CreatelogsDto,
  Logs,
  LogsService,
} from '@application/shared-api';
import { CreateUserDto, UsersService } from '@application/shared-api';
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
import * as uuid from 'uuid';

@Controller('logs')
export class LogsController {
  constructor(
    private logsService: LogsService,
    
  ) {}

  //@UseGuards(JwtAuthGuard)
  @Post()
  async add(@Body() createlogsDto: CreatelogsDto) {
    return this.logsService.addlogs(createlogsDto);
  }

}