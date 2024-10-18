import { JwtAuthGuard } from '@application/auth';
import {
  Pearls,
  PearlsService,
  PearlSubjectsService
} from '@application/shared-api';
import { CreatePearlSubjectsDto } from '@application/shared-api';
import { PeralInputSubjectInterface, FlagsInterface, UserKeyInterface, PearlChapterInterface } from '@application/api-interfaces';
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

@Controller('pearlsubjects')
export class PearlSubjectsController {
  // createPearlSubjectsDto: any;
  constructor(
    private peralSubjectService: PearlSubjectsService,
  ) { }


  @Post()
  async add(@Body() createPearlSubjectsDto: CreatePearlSubjectsDto) {

    this.peralSubjectService.addPearlSubjects(createPearlSubjectsDto);
    return true;

  }
  @Post('getSubjectsAndChapters')
  async getSubjectsAndChapters(@Body() pearlData: any) {

    let pearlId = pearlData.pearlId;
    return this.peralSubjectService.getSubjectsAndChapters(pearlId);

  }


  @Post('updatePearlSubjects')
  async updatePearlSubjects(@Body() createPearlSubjectsDto: CreatePearlSubjectsDto) {

    return this.peralSubjectService.updatePearlSubjects(createPearlSubjectsDto);
  }

  //  @Put(':subjectUuid')
  //   async editByUuid(
  //     @Param('subjectUuid')
  //     subjectUuid: string,
  //     @Body() pearlSubjects: PeralInputSubjectInterface
  //   ) {
  //     return this.peralSubjectService.editPearlSubjectByUuid(subjectUuid, pearlSubjects);
  //   }

}