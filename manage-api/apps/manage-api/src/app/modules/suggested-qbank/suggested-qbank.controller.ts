import { BannerInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  Banner,
  SuggestedQbankService,
  CreateSuggestedQbankDto,
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

@Controller('suggestedqbank')
export class SuggestedQbankController {

    constructor(private suggestedQbankService: SuggestedQbankService) {}

  //@UseGuards(JwtAuthGuard)
  @Post()
  async add(@Body() createSuggestedQbankDto: CreateSuggestedQbankDto) {
    return this.suggestedQbankService.create(createSuggestedQbankDto);
  }

  @Get()
  async findAll(){
    return this.suggestedQbankService.findAll();
  }

  @Put('status/:id')
  async updateStatus(
    @Param('id')
    id: string,
    @Body() status: any
  ){
    return this.suggestedQbankService.updateStatus(id,status);
  }



}