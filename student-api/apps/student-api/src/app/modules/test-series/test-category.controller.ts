import { JwtAuthGuard } from '@application/auth';
import { MobileTestCategoryService, QBank, TSCategories, Video } from '@application/shared-api';
import { Request, Body, Controller, Get, Param, Query, UseGuards, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('ts/categories')
export class TestCategoryController {

  constructor(private categoryService: MobileTestCategoryService) { }

  //  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<any> {
    try {
      var data = await this.categoryService.findAll();
      return { "status": true, "code": 2000, 'message': 'Test Categories Fetched Successfully', 'data': data }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  findOne(
    @Param('uuid')
    uuid: string
  ) {
    console.log(this.categoryService.findByUuid(uuid));

    return this.categoryService.findByUuid(uuid);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch Videos by Subject ID' })
  @ApiResponse({
    status: 200,
    description: 'Videos list Fetched Successfully',
    type: [TSCategories],
  })
  @Post('byCourseId')
  async findCatsByCourseId(@Request() request, @Body() body): Promise<any> {
    try {
      if (body.courseId) {
        var data = await this.categoryService.findAllByCourseId(request, body);
        return { "status": true, "code": 2000, 'message': 'Test Categories Fetched Successfully', 'data': data }
      }
      else {
        return { "status": false, "code": 2001, 'message': 'Course Id Required', 'data': [] }
      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch categories by Course ID' })
  @ApiResponse({
    status: 200,
    description: 'fetch categories Successfully',
    type: [TSCategories],
  })
  @Post('v2/byCourseId')
  async v2findCatsByCourseId(@Request() request, @Body() body): Promise<any> {
    try {
      if (body.courseId) {
        var data = await this.categoryService.v2findAllByCourseId(request, body);
        return { "status": true, "code": 2000, 'message': 'Test Categories Fetched Successfully', 'data': data }
      }
      else {
        return { "status": false, "code": 2001, 'message': 'Course Id Required', 'data': [] }
      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch Videos by Subject ID' })
  @ApiResponse({
    status: 200,
    description: 'Videos list Fetched Successfully',
    type: [TSCategories],
  })
  @Post('categoriesByCourseId')
  async findCategoriesByCourseId(@Request() request, @Body() body): Promise<any> {
    try {
      if (body.courseId) {
        var data = await this.categoryService.findCategoriesByCourseId(request, body);
        return { "status": true, "code": 2000, 'message': 'Test Categories Fetched Successfully', 'data': data }
      }
      else {
        return { "status": false, "code": 2001, 'message': 'Course Id Required', 'data': [] }
      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch Videos by Subject ID' })
  @ApiResponse({
    status: 200,
    description: 'Videos list Fetched Successfully',
    type: [TSCategories],
  })
  @Post('getTestSeriesTopicsBycategorieId')
  async getTestSeriesTopicsBycategorieId(@Request() request, @Body() body): Promise<any> {
    try {
      if (body.categorieId) {
        var data = await this.categoryService.getTestSeriesTopicsBycategorieId(request, body);
        return { "status": true, "code": 2000, 'message': 'Test Topics Fetched Successfully', 'data': data }
      }
      else {
        return { "status": false, "code": 2001, 'message': 'categorie Id Required', 'data': [] }
      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }


  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch Questions by Category & Test UUID' })
  @ApiResponse({
    status: 200,
    description: 'Questions list Fetched Successfully',
    type: [TSCategories],
  })
  @Post('test/questions')
  async getTestQuestionsByUuid(@Request() request, @Body() body): Promise<any> {
    try {
      if (body.categoryUuid && body.testUuid) {
        var data = await this.categoryService.getTestQuestionsByUuid(request, body);
        return { "status": true, "code": 2000, 'message': 'Questions Fetched Successfully', 'data': data }
      }
      else {
        return {
          "status": false, "code": 2001, 'message': 'Category Uuid Required', 'data': {}
        }
      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch Questions by Category & Test UUID' })
  @ApiResponse({
    status: 200,
    description: 'Questions list Fetched Successfully',
    type: [TSCategories],
  })
  @Post('test/questions-re-attempt')
  async getReAttemptTestQuestionsByUuid(@Request() request, @Body() body): Promise<any> {
    try {
      if (body.categoryUuid && body.testUuid) {
        var data = await this.categoryService.getReAttemptTestQuestionsByUuid(request, body);
        return { "status": true, "code": 2000, 'message': 'Questions Fetched Successfully', 'data': data }
      }
      else {
        return {
          "status": false, "code": 2001, 'message': 'Category Uuid Required', 'data': {}
        }
      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }


  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check Test Status' })
  @ApiResponse({
    status: 200,
    description: 'Check Test Series Status',
    type: [TSCategories],
  })
  @Post('checkTestStatus')
  async checkTestStatus(@Request() request, @Body() body): Promise<any> {
    try {
      if (body.categoryUuid && body.testUuid) {
        var data = await this.categoryService.checkTestStatus(request, body);
        return { "status": data.status, "code": data.code, 'message': data.message, 'data': data.data }
      }
      else {
        return {
          "status": false, "code": 2001, 'message': 'Category Uuid Required', 'data': {}
        }
      }
    } catch (error) {
      return { "status": false, "code": 5000, 'message': 'Server error', 'data': {} }
    }
  }


  
}
