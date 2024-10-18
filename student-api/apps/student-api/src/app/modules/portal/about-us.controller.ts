import type { AboutInterface  } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import { AboutUs, AboutUsService, CreateAboutUsDTO } from '@application/shared-api';
import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';

@Controller('portal/about')
export class AboutUsController {

  constructor(
    private aboutUsService: AboutUsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAboutUsPage(@Body() payload: CreateAboutUsDTO) {

    return this.aboutUsService.createAboutUsPage(payload);

  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateAboutUsPage(
    @Body() payload: AboutInterface
  ) {
    return this.aboutUsService.updateAboutUsPage(payload);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async getAboutUsPage(): Promise<any> {
    var data = await this.aboutUsService.getAboutUs();
    return { "status": true, "code": '2000', 'message':'Aboutus'  ,'data': data }
  }

}
