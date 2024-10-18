import { JwtAuthGuard } from '@application/auth';
import {
  Pearls,
  PearlsService,
} from '@application/shared-api';
import { CreatePearlsDto, UsersService } from '@application/shared-api';
import { PearlsInputInterface,FlagsInterface, UserKeyInterface } from '@application/api-interfaces';
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

@Controller('pearls')
export class PearlsController {
  constructor(
    private peralsService: PearlsService,
  ) {}
  
  // @UseGuards(JwtAuthGuard)
  @Post()
    async add(@Body() createPearlsDto: CreatePearlsDto) {
      return this.peralsService.create(createPearlsDto);
    }
  // @UseGuards(JwtAuthGuard)
  @Get()
    async findAll(): Promise<Pearls[]> {
      return this.peralsService.findAll();
    }
  // @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    return this.peralsService.findByUuid(uuid);
  }

  @Get('questions/:uuid')
  getPeralQuestions(
    @Param('uuid')
    uuid: string
  ) {
    return this.peralsService.getPeralQuestions(uuid);
  }

  // @UseGuards(JwtAuthGuard)
  @Put(':uuid')
  editByUuid(
    @Param('uuid')
    uuid: string,
    @Body() perals: PearlsInputInterface
  ) {
    return this.peralsService.editPearlsByUuid(uuid, perals);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  deleteByUuid(
    @Param('uuid')
    uuid: string
  ) {
    return this.peralsService.deleteByUuid(uuid);
  }
}