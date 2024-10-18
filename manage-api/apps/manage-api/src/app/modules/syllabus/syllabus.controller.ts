import { SyllabusInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  CreateSyllabusDto,
  Syllabus,
  SyllabusService,
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

@Controller('syllabus')
export class SyllabusController {
  constructor(private syllabusService: SyllabusService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createSyllabusDto: CreateSyllabusDto) {
    return this.syllabusService.create(createSyllabusDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Syllabus[]> {
    return this.syllabusService.findAll();
  }

  @Get('getSubjectsAndChapters')
  async getSubjectsAndChapters(): Promise<Syllabus[]> {
    return this.syllabusService.getSubjectsAndChapters();
  }

  @UseGuards(JwtAuthGuard)
  @Get('getSubject/ChapterList/:uuid')
  getSubjectOrChapterList(
    @Param('uuid')
    uuid: string
  ) {
    return this.syllabusService.getSubjectOrChapterList(uuid);
  }

  @Get('only/subjects')
  async onlySubjects(): Promise<Syllabus[]> {
    return this.syllabusService.onlySubjects();
  }

  @Get('only/chapters')
  async onlyChapters(): Promise<Syllabus[]> {
    return this.syllabusService.onlyChapters();
  }

  // @UseGuards(JwtAuthGuard)
  @Get('subjects/search')
  async findSubejcts(): Promise<Syllabus[]> {
    return this.syllabusService.findSubejcts();
  }

  @Get('active/subjects')
  async getActiveSyllabus(): Promise<Syllabus[]>{
    return this.syllabusService.getActiveSyllabus();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    return this.syllabusService.findByUuid(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  deleteByUuid(
    @Param('uuid')
    uuid: string
  ) {

    return this.syllabusService.deleteByUuid(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':uuid')
  editByUuid(
    @Param('uuid')
    uuid: string,
    @Body() syllabus: SyllabusInterface
  ) {
    return this.syllabusService.editSyllabusByUuid(uuid, syllabus);
  }


  @Post('getChapters')
  async fetChapters(@Body() request: any) : Promise<any[]>{

    return this.syllabusService.fetChapters(request);
  }
  @Post('fetChapters')
  async getChapters(@Body() request: any) : Promise<any[]>{

    return this.syllabusService.fetChapters(request);
  }
  @Post('fetChapters/videos')
  async getvideoChapters(@Body() request: any) : Promise<any[]>{

    return this.syllabusService.getvideoChapters(request);
  }
}
