import { CareerInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  Career,
  CareersService,
  CreateJobDTO,
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

@Controller('portal/careers')
export class CareersController {

  constructor(
    private careersService: CareersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addJob(@Body() createJobDto: CreateJobDTO) {
    return this.careersService.createJob(createJobDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Career[]> {
    return this.careersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':jobUuid')
  findOne(
    @Param('jobUuid')
    jobUuid: string
  ) {
    return this.careersService.findOne(jobUuid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':jobUuid')
  deleteByUuid(
    @Param('jobUuid')
    jobUuid: string
  ) {
    return this.careersService.deleteOne(jobUuid);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':jobUuid')
  editByUuid(
    @Body() career: CareerInterface
  ) {
    return this.careersService.updateOne(career);
  }
}
