import { BannerInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  Banner,
  BannersService,
  CreateBannerDTO,
  CreateSampleDTO,
  SampleService,
  Sample,
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

@Controller('sample')
export class SampleController {
  constructor(private sampleService: SampleService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  async add(@Body() createBannersDto: CreateSampleDTO) {
    return this.sampleService.create(createBannersDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Sample[]> {
    return this.sampleService.findAll();
  }
  // @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    return this.sampleService.findByUuid(uuid);
  }
  //
  @Get('byid/:id/:uuid')
  findOneByID(
    @Param('id')
    id: string,
    @Param('uuid')
    uuid: string
  ) {
    return this.sampleService.findByid(id,uuid);
  }

  @Get('search/:title')
  searchByTitle(
    @Param('title')
    title: string
  ) {
    return this.sampleService.searchByTitle(title);
  }

}
