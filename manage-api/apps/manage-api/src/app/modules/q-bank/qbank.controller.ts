import { QBankInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import { CreateQBankDTO, QBank, QbankService, QBankSubject, QbankSubjectService } from '@application/shared-api';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('qbank')
export class QBankController {

  constructor(
    private qbankService: QbankService,
    private qBankSubjectService: QbankSubjectService,
  ) {}

  @Post('subjects/:uuid/tests')
  async createQBank(@Body() createQBanksDTO: CreateQBankDTO) {
    return this.qBankSubjectService.addSubjectTopic(createQBanksDTO);
  }

  @Post('subjects/bulkTests')
  async createBulkTopics(@Body() response: any) {
    return this.qBankSubjectService.createBulkTopics(response);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('subjects/:uuid/chapter/:capterUuid/tests/:topicUuid')
  findTopicByUuid(
    @Param('uuid')
    uuid: string,
    @Param('capterUuid')
    capterUuid: string,
    @Param('topicUuid')
    topicUuid: string
  ) {
    return this.qbankService.findByUuid(uuid,capterUuid, topicUuid);
  }

  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch QBanks by Course Id' })
  @ApiResponse({
    status: 200,
    description: 'QBanks Fetched Successfully',
    type: [QBank],
  })
  @Get('courses/:id')
  async findByCourse(@Param('id') courseId: string): Promise<QBankSubject[]> {
    return this.qBankSubjectService.findByCourse(courseId);
  }
  @Post('subjectsByCourseIds')
  async findSubjectsByCoueseId( @Body() coursesarr: any) {
    return this.qBankSubjectService.findSubjectsByCoueseIds(coursesarr);
  }

  @Delete('subjects/:uuid/tests/:topicUuid')
  deleteByUuid(
    @Param('uuid')
    uuid: string,
    @Param('topicUuid')
    topicUuid: string
  ) {
    return this.qbankService.deleteByUuid(uuid, topicUuid);
  }

  @Put('subjects/:uuid/tests/:topicUuid')
  editByUuid(
    @Param('uuid')
    uuid: string,
    @Body() test: QBankInterface
  ) {
    return this.qbankService.editByUuid(test);
  }

  @Post('resetUser/:userId')
  async resetUserTest( 
    @Param('userId')
    userId: string,
    @Body() body: any) {
    try {
      var data = await this.qbankService.resetUserTest(userId,body);
      return { "status": data.status, "code": data.code, 'message':data.message,'data': data.data }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

}
