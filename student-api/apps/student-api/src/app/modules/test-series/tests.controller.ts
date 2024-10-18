import { JwtAuthGuard } from '@application/auth';
import { MobileTestsService, ReportError, ReportErrorDTO, StartTestDTO, StopTestDTO, SubmitTestService, SubmitUserTestDTO, Test, TestResultsService } from '@application/shared-api';
import { Request, Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as uuidV4 from 'uuid';

@Controller('ts/tests')
export class TestsController {

  constructor(
    private testService: MobileTestsService,
    private submitTestService: SubmitTestService,
    private testResultsService: TestResultsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('submit')
  async submitUserTest(@Request() req,@Body() submitTestDTO: SubmitUserTestDTO) {

    var data = await this.submitTestService.SubmittedTest(submitTestDTO,req);
    return {"status": true,"code" : 2000, 'message' : 'Test Submitted','data' : data}

  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Test[]> {

    return this.testService.findAll();

  }

  @UseGuards(JwtAuthGuard)
  @Get('byCategoryId/:id')
  async findAllTestsByCatId(@Param('id') id: string, @Query() query): Promise<Test[]> {

    return this.testService.findAllTestsByCatId(id, query);

  }

  @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {

    return this.testService.findByUuid(uuid);

  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch Tests by Course Id' })
  @ApiResponse({
    status: 200,
    description: 'Tests Fetched Successfully',
    type: [Test],
  })
  @Get('courses/:id')
  async findByCourse(@Param('id') courseId: string): Promise<Test[]> {

    return this.testService.findByCourse(courseId);

  }

  // ----------- TEST RESULTS ---------------

  @UseGuards(JwtAuthGuard)
  @Post('getLeaderBoardUserAnalysis')
  async getLeaderBoardUserAnalysis(
    @Request() req,@Body() body
  ) {

    var data = await this.testResultsService.getLeaderBoard(req, body);
    return {"status": true,"code" : 2000, 'message' : 'Fetched Analysis','data' : data}
  }

  @UseGuards(JwtAuthGuard)
  @Get(':uuid/users/:userUuid/review')
  getUserReview(
    @Param('uuid') uuid: string,
    @Param('userUuid') userUuid: string
  ) {

    return this.testResultsService.getReview(uuid, userUuid);

  }

  @UseGuards(JwtAuthGuard)
  @Get(':uuid/users/:userUuid/review/questions/:questionUuid')
  getUserReviewQuestion(
    @Param('uuid') uuid: string,
    @Param('userUuid') userUuid: string,
    @Param('questionUuid') questionUuid: string
  ) {

    return this.testResultsService.getReviewQuestionDetails(uuid, userUuid, questionUuid);

  }

  // ----------- SUBMIT TEST ERROR REPORT ---------------

  @UseGuards(JwtAuthGuard)
  @Post('reportError')
  reportError(@Body() reportErrorDto: ReportErrorDTO): Promise<ReportError> {

    reportErrorDto.uuid = uuidV4.v4();
    return this.testService.reportError(reportErrorDto);

  }

  // ----------- START TEST ---------------

  @UseGuards(JwtAuthGuard)
  @Post('startTest')
  startTest(
    @Request() request,
    @Body() startTestDTO: StartTestDTO
  ) {

    return this.testService.startTest(request, startTestDTO);

  }
  // @UseGuards(JwtAuthGuard)
  // @Post(':uuid/user/:userUuid/startTest')
  // startTest(
  //   @Param('uuid') testUuid: string,
  //   @Param('userUuid') userUuid: string,
  //   @Body() startTestDTO: StartTestDTO
  // ) {

  //   return this.testService.startTest(testUuid, userUuid, startTestDTO);

  // }

  // ----------- STOP TEST ---------------

  @UseGuards(JwtAuthGuard)
  @Post(':uuid/user/:userUuid/stopTest')
  stopTest(
    @Param('uuid') testUuid: string,
    @Param('userUuid') userUuid: string,
    @Body() stopTestDTO: StopTestDTO
  ) {

    return this.testService.stopTest(testUuid, userUuid, stopTestDTO);

  }

  // ----------- CALCULATE USER TEST ELAPSED TIME ---------------

  @UseGuards(JwtAuthGuard)
  @Get(':uuid/user/:userUuid/getBalanceTime')
  calculateUserTestElapsedtime(
    @Param('uuid') testUuid: string,
    @Param('userUuid') userUuid: string,
  ) {

    return this.testService.calculateUserTestElapsedtime(testUuid, userUuid);

  }

}
