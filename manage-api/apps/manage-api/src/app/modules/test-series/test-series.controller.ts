import { TestCategoryInterface } from '@application/api-interfaces';
import { CreateTSCategoriesDTO, TestCategoryService, TSCategories,TestSeriesService } from '@application/shared-api';
import { Body, Controller, Delete, Get, Param, Post, Put,
  Query,
  UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@application/auth';

import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
@Controller('test-series')
export class TestSeriesController {

  constructor(private testSeriesService: TestSeriesService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('questions')
  async getTestSeriesQuestions(@Body() request: any) {
    return this.testSeriesService.getTestSeriesQuestions(request);
  }

   @Get('paginate')
  async backend(
      @Query('page') page,
      @Query('limit') limit,
      @Query('search') search,
      @Query('subjectIds') subjects,
      @Query('sort') sort,
      @Body() request: any
    ) {

      let options = {};
      if(!page){
        page = 1
      }
      if(!limit){
        limit = 10
      }
      if (subjects) {
          options = {
            syllabus: { $in: subjects },
            // 'flags.active': true,
            // "flags.testSeries": true,
              // $or: [
              //     { title: new RegExp(search.toString(), 'i') },
              //     { description: new RegExp(search.toString(), 'i') },
              // ]
          }
      }
      console.log(options)
      const query = this.testSeriesService.find(options);
      if (sort) {
          query.sort({
            createdOn: sort
          })
      }

      const pagee  : number = parseInt(page);
      const limitt : number = parseInt(limit);
      const total = await this.testSeriesService.count(options);
      const data  = await query.skip((pagee - 1) * limitt).limit(limitt).exec();

      return {
          data,
          totalRecords : total,
          currentPage : pagee,
          last_page: Math.ceil(total / limit),
          search:search,
          sort:sort,
      };
  }
}
