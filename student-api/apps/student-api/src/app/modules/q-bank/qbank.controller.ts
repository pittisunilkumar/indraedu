import { JwtAuthGuard } from '@application/auth';
import { MobileQbankService, MobileQbankSubjectService, QBank, StartTopicDTO, StopTopicDTO, SubmitQbankTopicService, SubmitTopicResultsService, SubmitUserQBankTopicDTO, Syllabus } from '@application/shared-api';
import { Request, Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

@Controller('qbank')
export class QBankController {

  constructor(
    private qbankService: MobileQbankService,
    private qbankSubjectService: MobileQbankSubjectService,
    private submitTopicService: SubmitQbankTopicService,
    private submitTopicResultsService: SubmitTopicResultsService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('topics/submit')
  async submitUserQBankTopic(@Request() req, @Body() submitTestDTO: SubmitUserQBankTopicDTO) {
    try {
      var data = await this.submitTopicService.SubmittedTest(submitTestDTO, req);
      return { "status": true, "code": 2000, 'message': 'Test Submitted', 'data': data }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('resetUserTest')
  async resetUserTest(@Request() req, @Body() body: any) {
    try {
      var data = await this.submitTopicService.resetUserTest(req, body);
      return { "status": data.status, "code": data.code, 'message':data.message,'data': data.data }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @Get('chapters/bySubjectUuid/:subjectUuid')
  async findAllChaptersBySubjectUuid(
    @Param('subjectUuid')
    subjectUuid: string
  ): Promise<QBank[]> {
    return this.qbankService.findAllTopicsBySubjectUuid(subjectUuid);
  }

  @Get('topics/bySubjectUuid/:subjectUuid')
  async findAllTopicsBySubjectUuid(
    @Param('subjectUuid')
    subjectUuid: string
  ): Promise<QBank[]> {
    return this.qbankService.findAllTopicsBySubjectUuid(subjectUuid);
  }

  @UseGuards(JwtAuthGuard)
  @Get('subjectsByCourseId/:courseUuid')
  async findAllQbankSubjectsByCourseID(@Param('courseUuid') courseUuid: string): Promise<Syllabus[]> {
    return this.qbankService.findSubjectsByCourse(courseUuid);
  }

  @UseGuards(JwtAuthGuard)
  @Post('subjectsByCourseId')
  async getQbankSubjectsByCourseID(@Body() request): Promise<Syllabus[]> {
    console.log(request)
    return this.qbankService.findSubjectsByCourse(request.course_uuid);
  }

  // ----------- START TOPIC ---------------

  // @UseGuards(JwtAuthGuard)
  // @Post('topics/:uuid/user/:userUuid/startTopic')
  // startTest(
  //   @Param('uuid') topicUuid: string,
  //   @Param('userUuid') userUuid: string,
  //   @Body() startTestDTO: StartTopicDTO
  // ) {

  //   return this.qbankService.startTopic(topicUuid, userUuid, startTestDTO);

  // }

  @UseGuards(JwtAuthGuard)
  @Post('topics/user/startTopic')
  async startTest(
    @Body() startTestDTO: StartTopicDTO,
    @Request() req,
  ) {
    try {
      var data = await this.qbankService.startTopic(startTestDTO, req);
      return { "status": true, "code": 2000, 'message': 'Test Started', 'data': data }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
    // return this.qbankService.startTopic(startTestDTO,req);

  }

  // ----------- STOP TOPIC ---------------

  // @UseGuards(JwtAuthGuard)
  // @Post('topics/:uuid/user/:userUuid/stopTopic')
  // stopTest(
  //   @Param('uuid') topicUuid: string,
  //   @Param('userUuid') userUuid: string,
  //   @Body() stopTestDTO: StopTopicDTO
  // ) {

  //   return this.qbankService.stopTopic(topicUuid, userUuid, stopTestDTO);

  // }

  @UseGuards(JwtAuthGuard)
  @Post('topics/user/stopTopic')
  async stopTest(
    @Body() stopTestDTO: StopTopicDTO,
    @Request() req,
  ) {
    try {
      // return this.qbankService.stopTopic(stopTestDTO,req);
      // console.log(stopTestDTO)
      var data = await this.qbankService.stopTopic(stopTestDTO, req);
      return { "status": true, "code": 2000, 'message': 'Test Stopped', 'data': data }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  // ----------- TEST RESULTS ---------------

  @UseGuards(JwtAuthGuard)
  @Get('topics/:uuid/users/:userUuid/userAnalysis')
  getLeaderBoardUserAnalysis(
    @Param('uuid') uuid: string,
    @Param('userUuid') userUuid: string,
    @Query() query,
  ) {

    return this.submitTopicResultsService.getLeaderBoard(uuid, userUuid, query);

  }

  @UseGuards(JwtAuthGuard)
  @Post('topics/getreview')
  async getUserReview(
    @Body() body,
    @Request() req,
  ) {
    try {
      var data = await this.submitTopicResultsService.getReview(body.qbankTopicUuid, req.user);
      return { "status": true, "code": 2000, 'message': 'Test Reviews', 'data': data }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('topics/:uuid/users/:userUuid/review/questions/:questionUuid')
  getUserReviewQuestion(
    @Param('uuid') uuid: string,
    @Param('userUuid') userUuid: string,
    @Param('questionUuid') questionUuid: string,
    @Query() query,
  ) {

    return this.submitTopicResultsService.getReviewQuestionDetails(uuid, userUuid, questionUuid, query);

  }

}
