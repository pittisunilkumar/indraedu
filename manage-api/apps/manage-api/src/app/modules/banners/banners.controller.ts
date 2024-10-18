import { BannerInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import { MongoError } from 'mongodb';
import {
  Banner,
  BannersService,
  CreateBannerDTO,
} from '@application/shared-api';
import {
  ArgumentsHost,
  Body,
  Controller,
  Delete,
  ExceptionFilter,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

export class MongoFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    if (exception.code === 11000) {
      response.status(400).json({ message: 'Success.' });
    } else {
      response.status(500).json({ message: 'The input Order is already taken, please enter a new one' });
    }
  }
}

@Controller('banners')
export class BannersController {
  constructor(private bannersService: BannersService) {}

  @UseGuards(JwtAuthGuard)
 // @UseFilters(MongoFilter)
  @Post()
  async add(@Body() createBannersDto: CreateBannerDTO) {
    return this.bannersService.create(createBannersDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() request): Promise<Banner[]> {
    const employee = request.user;

    return this.bannersService.findAll(employee);
  }

  //@UseGuards(JwtAuthGuard)
  @Get(':uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    return this.bannersService.findByUuid(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  deleteByUuid(
    @Param('uuid')
    uuid: string
  ) {
    return this.bannersService.deleteByUuid(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':uuid')
  editByUuid(
    @Param('uuid')
    uuid: string,
    @Body() banner: BannerInterface
  ) {
    return this.bannersService.editBannerByUuid(uuid, banner);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard/count')
  async dashboardCount(@Request() request) {
    const employee = request.user;

    return this.bannersService.dashboardCount(employee);
  }
}


