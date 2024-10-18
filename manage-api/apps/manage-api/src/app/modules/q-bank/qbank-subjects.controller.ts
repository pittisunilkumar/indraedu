import { QBankInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import { CreateQBankSubjectDto, QBankSubject, QbankSubjectService, LogsService } from '@application/shared-api';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('qbank/subjects')
export class QBankSubjectController {

  constructor(private qbankService: QbankSubjectService,
    private logsService: LogsService) { }

  // @UseGuards(JwtAuthGuard)
  @Post()
  async createQBank(@Body() createQBankSubjectDTO: CreateQBankSubjectDto) {
    let result = this.qbankService.create(createQBankSubjectDTO);
    let logs_request = {
      'moduleName': 'QbankSubjects',
      'collectionName': 'QbankSubjects',
      'request': createQBankSubjectDTO,
      'documentId': (await result)._id,
      'createdOn': createQBankSubjectDTO.createdOn,
      'createdBy': createQBankSubjectDTO.createdBy,
    };
    console.log('logs_request', logs_request);
    const logs = this.logsService.addlogs(logs_request);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() request): Promise<QBankSubject[]> {
    const employee = request.user;
    return this.qbankService.findAll(employee);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('perals/qbankSubjects')
  async getQbankSubjects(): Promise<QBankSubject[]> {
    return this.qbankService.getQbankSubjects();
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    return this.qbankService.findByUuid(uuid);
  }

  //@UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch QBanks Subjects by Course Id' })
  @ApiResponse({
    status: 200,
    description: 'QBanks Subjects Fetched Successfully',
    type: [QBankSubject],
  })

  @Get('courses/:id')
  async findByCourse(@Param('id') courseId: string): Promise<QBankSubject[]> {
    return this.qbankService.findByCourse(courseId);
  }

  //@UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  deleteByUuid(
    @Param('uuid')
    uuid: string

  ) {
    return this.qbankService.deleteByUuid(uuid);
  }

  @Delete('qbanksubjects/:uuid/tests/:topicUuid')
  deleteByTestUuid(
    @Param('uuid')
    uuid: string,
    @Param('topicUuid')
    topicUuid: string
  ) {
    return this.qbankService.deleteByTestUuid(uuid, topicUuid);
  }
  @Get('qbsubject/:qbuuid/chapter/:cuuid/topic/:tuuid')
  // @Get('qbsubject/:qbuuid/topic/:tuuid')
  async findQbQuestions(
    @Param('qbuuid') qbuuid: string,
    @Param('cuuid') cuuid: string,
    @Param('tuuid') tuuid: string
  ): Promise<QBankSubject[]> {
    return this.qbankService.findQbQuestions(qbuuid, cuuid, tuuid);
    // return this.qbankService.findQbQuestions(qbuuid,tuuid);

  }

  @UseGuards(JwtAuthGuard)
  @Put(':uuid')
  async editByUuid(
    @Param('uuid')
    uuid: string,
    @Body() test: QBankInterface
  ) {
    let result: any;
    result = await this.qbankService.editByUuid(test);
console.log('resultresult123456',result);

    let logs_request = {
      'moduleName': 'QbankSubjects',
      'collectionName': 'QbankSubjects',
      'request': test,
      'documentId': result._id,
      'modifiedOn': test.modifiedOn,
      'modifiedBy': test.modifiedBy,
    };
    console.log('logs_request', logs_request);
    const logs = this.logsService.addlogs(logs_request);
    return result;
  }

  @Delete('qbsubjects/:uuid/chapters/:cUuid/tests/:topicUuid/que/:queUuid')
  deleteQueByUuid(
    @Param('uuid')
    uuid: string,
    @Param('cUuid')
    cUuid: string,
    @Param('topicUuid')
    topicUuid: string,
    @Param('queUuid')
    queUuid: string
  ) {
    return this.qbankService.deleteQueByUuid(uuid, cUuid, topicUuid, queUuid);
  }
  @Post('copyQBQuestions')
  async copyQBQuestions(
    //@Param('uuid')
    //uuid: string,
    @Body() qbquestions: QBankInterface) {
    return this.qbankService.copyQBQuestions(qbquestions);
  }
  @Post('copyQBTopics')
  async copyQBTopics(
    @Body() qbtopics: QBankInterface) {
    return this.qbankService.copyQBTopics(qbtopics);
  }

  @Post('copyQBChapter')
  async copyQBChapter(
    @Body() qbchapters: QBankInterface) {
    return this.qbankService.copyQBChapter(qbchapters);
  }

  @Post('moveQBQuestions')
  moveQBQuestions(
    // @Param('uuid')
    // uuid: string,
    @Body() moveqbquestions: QBankInterface
  ) {
    return this.qbankService.moveqbquestions(moveqbquestions);
  }

  @Post('dragAndDropQBQuestions')
  dragAndDropQBQuestions(
    // @Param('uuid')
    // uuid: string,
    @Body() dragAndDropQBQuestions: QBankInterface
  ) {
    return this.qbankService.dragAndDropQBQuestions(dragAndDropQBQuestions);
  }

  @Post('dragAndDropQBTopics')
  dragAndDropQBTopics(
    @Body() dragAndDropQBTopics: any
  ) {
    return this.qbankService.dragAndDropQBTopics(dragAndDropQBTopics);
  }
  @Post('dragAndDropQBChapters')
  dragAndDropQBChapters(
    @Body() dragAndDropQBChapters: any
  ) {
    return this.qbankService.dragAndDropQBChapters(dragAndDropQBChapters);
  }
  @Post('dragAndDropQBSubjects')
  dragAndDropQBSubjects(
    @Body() dragAndDropQBChapters: any
  ) {
    return this.qbankService.dragAndDropQBSubjects(dragAndDropQBChapters);
  }

  @Post('moveQBTopics')
  moveQBTopics(
    // @Param('uuid')
    // uuid: string,
    @Body() moveqbtopics: QBankInterface
  ) {
    return this.qbankService.moveqbtopics(moveqbtopics);
  }
  @Post('moveQBChapters')
  moveQBChapters(
    // @Param('uuid')
    // uuid: string,
    @Body() moveqbchaptrers: QBankInterface
  ) {
    return this.qbankService.moveqbchaptrers(moveqbchaptrers);
  }

  @Post('deleteQBChapters')
  async deleteQBChapters(
    @Body() qbchapters: QBankInterface) {
    return this.qbankService.deleteQBChapters(qbchapters);
  }

  @Post('deleteQBQuestions')
  async deleteQBQuestions(
    @Body() qbquestions: QBankInterface) {
    return this.qbankService.deleteQBQuestions(qbquestions);
  }
  @Post('deleteQBTopics')
  async deleteMultipleTopics(@Body() qbchapters: QBankInterface) {
    return this.qbankService.deleteMultipleTopics(qbchapters);
  }


}
