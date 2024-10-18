import { TestCategoryInterface,TestInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import { CreateTSCategoriesDTO, TestCategoryService, TSCategories } from '@application/shared-api';
import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
@Controller('ts/categories')
export class TestCategoryController {

  constructor(private categoryService: TestCategoryService) {}

  @Post()
  async createTSCategories(@Body() createTSCategoriesDTO: CreateTSCategoriesDTO) {
    return this.categoryService.create(createTSCategoriesDTO);
  }
  @Post('insertTSTestes')
  async insertTSTests(@Body() request: any) {

    return this.categoryService.insertTSTests(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() request): Promise<TSCategories[]> {
    const employee = request.user;
    return this.categoryService.findAll(employee);
  }

  @Get('tests/:uuid')
  async getTests(@Param('uuid') catUuid: string) {
    return this.categoryService.getTests(catUuid);
  }

  @Post('subjectsByCourseIds')
  async findSubjectsByCoueseId( @Body() coursesarr: any) {
    return this.categoryService.findSubjectsByCoueseIds(coursesarr);
  }

  @Get('courses/:id')
  async findByCourse(@Param('id') courseId: string): Promise<any[]> {
    return this.categoryService.findByCourse(courseId);
  }

  @Get(':uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    console.log(this.categoryService.findByUuid(uuid));

    return this.categoryService.findByUuid(uuid);
  }

  @Post('getTestSeriesCourses')
  async getTestSeriesCourseByCategory(@Body() request: any) {

    return this.categoryService.getTestSeriesCourseByCategory(request);
  }



  @Delete(':uuid')
  deleteByUuid(
    @Param('uuid')
    uuid: string
  ) {
    return this.categoryService.deleteByUuid(uuid);
  }

  @Put(':uuid')
  editByUuid(
    @Body() category: TestCategoryInterface
  ) {
    return this.categoryService.editByUuid(category);
  }

  @Get('uuid/:uuid/testuuid/:testuuid')
  getTestsByUuid(
    @Param('uuid')
    uuid: string,
    @Param('testuuid')
    testuuid: string
  ) {
  //  console.log(this.categoryService.findByUuid(uuid));

    return this.categoryService.getTestsByUuid(uuid,testuuid);
  }

  @Put('uuid/:uuid/test/:testUuid')
  editTestByUuid(
    @Body() test: TestInterface
  ) {
    return this.categoryService.editTestByUuid(test);
  }

  @Delete('uuid/:uuid/test_series/:testUuid')
  deleteTestByUuid(
    @Param('uuid')
    uuid: string,
    @Param('testUuid')
    testUuid: string
  ) {
    return this.categoryService.deleteTestByUuid(uuid,testUuid);
  }

  @Get('uuid/:uuid/tsTestuuid/:testuuid')
  getTestQuestionsByUuid(
    @Param('uuid')
    uuid: string,
    @Param('testuuid')
    testuuid: string
  ) {
  //  console.log(this.categoryService.findByUuid(uuid));

    return this.categoryService.getTestQuestionsByUuid(uuid,testuuid);
  }


  @Post('deleteTSQuestions')
  async deleteTSQuestions(
    @Body() qbquestions: any) {
    return this.categoryService.deleteTSQuestions(qbquestions);
  }

  // @Get('tsUuid/:uuid')
  // getTestsByTSUuid(
  //   @Param('uuid')
  //   uuid: string,
    
  // ) {
  //   return this.categoryService.getTestsByTSUuid(uuid);
  // }

  @Post('copyTSQuestions')
  async copyTSQuestions(
    @Body() tsquestions: TestCategoryInterface) {
    return this.categoryService.copyTSQuestions(tsquestions);
  }
  @Post('moveTSQuestions')
  moveTSQuestions(
    // @Param('uuid')
    // uuid: string,
    @Body() movetsquestions: TestCategoryInterface
  ) {
    return this.categoryService.moveTSQuestions(movetsquestions);
  }

  @Post('dragAndDropTSQuestions')
  dragAndDropTSQuestions(
    // @Param('uuid')
    // uuid: string,
    @Body() dragAndDropTSQuestions: TestCategoryInterface
  ) {
    return this.categoryService.dragAndDropTSQuestions(dragAndDropTSQuestions);
  }

  @Post('dragAndDropTests')
  dragAndDropTests(
    // @Param('uuid')
    // uuid: string,
    @Body() dragAndDropTests: any
  ) {
    return this.categoryService.dragAndDropTests(dragAndDropTests);
  }
  
  @Post('copyTSTests')
  async copyQBTopics(
    @Body() tstests: TestCategoryInterface) {
    return this.categoryService.copyTSTests(tstests);
  }

  @Post('moveTSTests')
  moveTSTests(
    @Body() movetstopics: TestCategoryInterface
  ) {
    return this.categoryService.moveTSTests(movetstopics);
  }

  @Post('update-test-series-upcoming-status')
  updateTestSeriesUpcoming(
  ){
    return this.categoryService.updateTestSeriesUpcoming();
  }

  @Get('createDailyTest/test')
  async createDailyTest(): Promise<any> {
    // try {
        var data = await this.categoryService.createDailyTest();
        return { "status": true, "code": 2000, 'message': 'Questions Fetched Successfully', 'data': data }
    // } catch (error) {
    //   return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    // }
  }
  @Get('vanishDailyTest/test')
  async vanishDailyTest(): Promise<any> {
    // try {
        var data = await this.categoryService.vanishDailyTest();
        return { "status": true, "code": 2000, 'message': 'Questions Fetched Successfully', 'data': data }
    // } catch (error) {
    //   return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    // }
  }

  @Post('getLeaderBoardUserAnalysis')
  async getLeaderBoardUserAnalysis(
    @Body() body
  ) {
    return await this.categoryService.getLeaderBoard( body);
    // return {"status": true,"code" : 2000, 'message' : 'Fetched Analysis','data' : data}
  }

  @Post('reset-test')
  async resetTest(
    @Body() body
  ) {
    return await this.categoryService.resetUserTest( body);
    // return {"status": true,"code" : 2000, 'message' : 'Fetched Analysis','data' : data}
  }

}
