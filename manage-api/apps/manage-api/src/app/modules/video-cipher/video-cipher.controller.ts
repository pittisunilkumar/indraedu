import { VideoCipherService } from '@application/shared-api';
import { Controller, Get, HttpService, Query } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Controller('vdocipher')
export class VideoCipherController {

  constructor(private vdocipher: VideoCipherService) {}

  @Get('all')
  findAllVideos(@Query() query): Observable<AxiosResponse<any>> {
    return this.vdocipher.findAll(query)
  }
}
