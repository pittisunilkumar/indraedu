import { BannerInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  Banner,
  SuggestedTestsService,
  CreateSuggestedTestsDto,
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

@Controller('suggestedtests')
export class SuggestedTestsController {

    constructor(private suggestedTestsService: SuggestedTestsService) {}

  //@UseGuards(JwtAuthGuard)
  @Post()
  async add(@Body() body : any) {
    return this.suggestedTestsService.create(body);
  }

  @Get()
  async findAll(){
    return this.suggestedTestsService.findAll();
  }

  @Put('status/:id')
  async updateStatus(
    @Param('id')
    id: string,
    @Body() status: any
  ){
    return this.suggestedTestsService.updateStatus(id,status);
  }



}